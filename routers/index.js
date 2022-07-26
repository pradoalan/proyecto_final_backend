const express = require('express');
const router = express.Router();

const productosRoutes = require('./productos/productos.routes');
const carritoRoutes = require('./carrito/carrito.routes')

//Middlewares
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

//Routes
router.use('/productos', productosRoutes);
router.use('/carrito', carritoRoutes);

module.exports = router;