const express = require('express');
const { engine } = require("express-handlebars");
const path = require('path');
const logger = require('./logger/index');
const { ENV: { PORT } } = require('./config');
const env = require('./env.config');
const dbConfig = require('./db/config');
const passport = require('./middlewares/passport');
const multer = require('multer');
const http = require('http');
const socketIo = require('socket.io');
const yargs = require('yargs')(process.argv.slice(2));
const os = require('os');
const cluster = require('cluster');

const session = require('express-session');
const MongoStore = require('connect-mongo');

const { ProductosDao } = require('./models/daos/index');
const productosDao = new ProductosDao();

const args = yargs
    .default({
        MODE: 'FORK'
    })
    .alias({
        m: 'MODE'
    })
    .argv;

const MODE = args.MODE;
const CPU_NUMBERS = os.cpus().length;

if (MODE === 'CLUSTER' && cluster.isPrimary) {
    logger.info(`I am the primary process with pid ${process.pid}!`);
    logger.info(`Cores number => ${CPU_NUMBERS}`);

    for (let i = 0; i < CPU_NUMBERS; i++) {
        cluster.fork(); 
    }

    cluster.on('exit', (worker, code) => {
        logger.info(`Worker ${worker.process.pid} died :(`)
        cluster.fork();
    });
}

if (!cluster.isPrimary || MODE === 'FORK') {
    const app = express();
    const httpServer = http.createServer(app);
    const io = socketIo(httpServer);

    //Storage para Multer
    const storage = multer.diskStorage({
        destination: (req, file, cb) => { 
            cb(null, 'public/avatars')
        },
        filename: (req, file, cb) => {
            const extension = file.mimetype.split('/')[1];
            cb(null, `${req.body.username}.${extension}`);
        }
    });

    // Middlewares
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static('./public'));
    app.use(session({
        name: 'session-proyecto-final-pb', 
        secret: env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: dbConfig.mongodb.connectTo('sesiones')
        }),
        ttl: 600,
        cookie: {
            maxAge: 600000
        }
    }));
    const upload = multer({ storage });

    //Passport
    app.use(passport.initialize());
    app.use(passport.session());

    //Index
    const apiRoutes = require('./routers/index');

    //Template engines
    app.engine('hbs', engine({
        extname: 'hbs',
        defaultLayout: 'main.hbs',
        layoutDir: path.resolve(__dirname, './public/layouts')
    }));
    app.set('views', './public');
    app.set('view engine', 'hbs');

    // Routes
    app.use('/api', apiRoutes);

    //Ruta inicio
    app.get('/', async (req, res) => {
        const user = req.user;

        if (user) {
            res.render('form', {
                emailUsuario: user.email,
                nombreUsuario: user.nombre,
                direccionUsuario: user.direccion,
                edadUsuario: user.edad,
                nroTelefonoUsario: user.nroTelefono,
                avatarUsuario: user.avatar
            });
        }
        else {
            res.redirect('/login');
        }
    });

    //Login GET
    app.get('/login', (req, res) => {
        return res.sendFile(__dirname + '/public/login.html');
    });

    //Login POST
    app.post(
        '/login',
        passport.authenticate('login', { failureRedirect: '/login-error' }),
        async (_req, res, _next) => res.redirect('/')
    );

    //Logout
    app.post('/logout', async (req, res) => {
        try {
            const user = req.user;
            req.session.destroy(err => {
                res.clearCookie('session-proyecto-final-pb'); 
                if (err) {
                    console.log(err);
                }
                else {
                    return res.render('logout', { nombreUsuario: user.email });
                }
            });
        }
        catch (err) {
            console.log(err);
        }
    });

    //Register GET
    app.get('/register', (req, res) => {

        return res.sendFile(__dirname + '/public/register.html');
    });

    //Register POST
    app.post(
        '/register',
        upload.single('avatar'),
        passport.authenticate('register', { failureRedirect: '/register-error' }),
        async (_req, res, _next) => res.redirect('/')
    );

    //Login-error
    app.get('/login-error', (req, res) => {

        return res.render('error', { textoError: 'Error al realizar el login' });
    });

    //Register-error
    app.get('/register-error', (req, res) => {

        return res.render('error', { textoError: 'Error al realizar el registro' });
    });

    //Devuelve 404
    app.get('*', function (req, res) {
        return res.status(404).json({ error: -2, descripcion: `El método: ${req.method} y la Ruta: ${req.originalUrl} no fueron implementados` });
    });
    app.post('*', function (req, res) {
        return res.status(404).json({ error: -2, descripcion: `El método: ${req.method} y la Ruta: ${req.originalUrl} no fueron implementados` });
    });
    app.put('*', function (req, res) {
        return res.status(404).json({ error: -2, descripcion: `El método: ${req.method} y la Ruta: ${req.originalUrl} no fueron implementados` });
    });
    app.delete('*', function (req, res) {
        return res.status(404).json({ error: -2, descripcion: `El método: ${req.method} y la Ruta: ${req.originalUrl} no fueron implementados` });
    });

    //Listener
    const connectedServer = httpServer.listen(PORT, () => {
        logger.info(`Server is up and running on port ${PORT}`);
    });

    //Errors
    connectedServer.on('error', (error) => {
        logger.error('Error: ' + error);
    });

    //Event sockets
    io.on('connection', async (socket) => {
        logger.info(`New client connection! Id: ${socket.id}`);

        const productos = await productosDao.getAll();
        socket.emit('actualiza-productos', productos);

        socket.on('disconnect', () => {
            logger.info(`Client has left! Id: ${socket.id}`);
        });
    });
}