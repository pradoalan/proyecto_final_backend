const authorizer = (req, res, next) => {

    const esAdmin = true;

    if (!esAdmin) {
        return res.status(401).json({ error: -1, descripcion: `ERROR: No tiene autorizacion para utilizar el método: ${req.method} y la ruta: ${req.originalUrl}` });
    }

    next();
};

module.exports = authorizer;