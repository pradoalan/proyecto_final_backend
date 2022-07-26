const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const logger = require('../logger/index');
const { enviarEmail } = require('../utils/envioMails');
const env = require('../env.config');

const { UsuariosMongooseDao } = require('../models/daos/usuarios/UsuariosMongooseDao');
const usuariosDao = new UsuariosMongooseDao();

const salt = () => bcrypt.genSaltSync(10);
const createHash = (pass) => bcrypt.hashSync(pass, salt());
const isValidPassword = (user, pass) => bcrypt.compareSync(pass, user.password);

//Passport Local Strategy
passport.use('login', new LocalStrategy(async (username, password, done) => {
    try {
        const user = await usuariosDao.getByEmail(username);

        if (!isValidPassword(user, password)) {
            logger.info('Contraseña o usuario invalido');

            return done(null, false);
        }

        return done(null, user);
    } catch (error) {
        logger.error('Error iniciando sesion: ', error);

        return done(null, false);
    }
}));

//Passport Local Strategy
passport.use('register', new LocalStrategy({
    passReqToCallback: true,
    },
    async (req, username, password, done) => {
        try {
            const extension = req.file?.mimetype?.split('/')[1];
            const userObject = {
                email: username,
                password: createHash(password),
                nombre: req.body.nombre,
                direccion: req.body.direccion,
                edad: req.body.edad,
                nroTelefono: req.body.nroTelefono,
                avatar: extension != undefined ? `${req.body.username}.${extension}` : undefined
            };

            const user = await usuariosDao.save(userObject);
            if (user === -1) {
                return done(null, false);
            }
            
            logger.info('Registro de usuario valido');

            enviarEmail(env.EMAIL_ADMINISTRATOR, 'Nuevo registro', JSON.stringify(userObject, null, 2));
            
            return done(null, user);
        } catch (error) {
            logger.error('Error iniciando sesion ', error);

            return done(null, false);
        }
}));

//Serializacion
passport.serializeUser((user, done) => {
    done(null, user._id);
});

//Deserializacion
passport.deserializeUser(async (id, done) => {
    const user = await usuariosDao.getById(id);

    done(null, user);
});

module.exports = passport;