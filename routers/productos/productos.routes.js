const express = require('express');
const logger = require('../../logger');
const router = express.Router();
const authMiddleware = require('../../middlewares/authorizer');

const { ProductosDao } = require('../../models/daos/index');
const productosDao = new ProductosDao();

router.get('/', async (req, res) => {

    const { id } = req.query;

    if (id) {
        const resultado = await productosDao.getById(id);

        if (resultado === -1) {
            return res.status(500).json({ mensaje: `Error al buscar el producto ${id}` });
        }
        if (resultado === null) {
            return res.status(404).json({ mensaje: `No se encontró el producto ${id}` });
        }

        return res.json(resultado);
    } else {
        const resultado = await productosDao.getAll();
        
        if (resultado === -1) {
            return res.status(500).json({ mensaje: 'Error al buscar todos los productos' });
        }
        if (resultado.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontraron productos' });
        }

        return res.json(resultado);
    }
});

router.post('/', authMiddleware, async (req, res) => {
    const { nombre, descripcion, codigo, fotoUrl, precio, stock } = req.body;

    if (!nombre || !descripcion || !codigo || !fotoUrl || !precio || !stock) {
        return res.status(400).json({ error: 'El formato enviado es incorrecto' });
    }

    const newProducto = { nombre, descripcion, codigo, fotoUrl, precio, stock };

    const resultado = await productosDao.save(newProducto);

    if (resultado === -1) {
        return res.status(500).json({ error: 'Error al agregar producto' });
    } else {
        return res.json({ mensaje: 'Producto agregado', nuevoProducto: resultado });
    }
});

router.put('/:id', authMiddleware, async (req, res) => {
    const { params: { id }, body: { nombre, descripcion, codigo, fotoUrl, precio, stock } } = req;

    if (!nombre || !descripcion || !codigo || !fotoUrl || !precio || !stock) {
        return res.status(400).json({ error: 'El formato enviado es incorrecto' });
    }

    const resultadoBusqueda = await productosDao.getById(id);

    if (resultadoBusqueda === -1) {
        return res.status(500).json({ mensaje: `Error al buscar el producto ${id}` });
    }
    if (resultadoBusqueda === null) {
        return res.status(404).json({ mensaje: `No se encontró el producto ${id}` });
    }

    let productoActualizado = { nombre, descripcion, codigo, fotoUrl, precio, stock };
    const resultadoActualiza = await productosDao.update(id, productoActualizado);

    if (resultadoActualiza === -1) {
        return res.status(500).json({ error: 'Error al modificar producto' });
    }

    return res.json({ mensaje: 'Producto modificado', productoActualizado: resultadoActualiza });
});

router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;

    const resultadoBusqueda = await productosDao.getById(id);

    if (resultadoBusqueda === -1) {
        return res.status(500).json({ mensaje: `Error al buscar el producto ${id}` });
    }
    if (resultadoBusqueda === null) {
        return res.status(404).json({ mensaje: `No se encontró el producto ${id}` });
    }

    const resultadoEliminacion= await productosDao.deleteById(id);

    if (!resultadoEliminacion) {
        return res.status(500).json({ error: 'Error al eliminar producto' });
    }

    return res.json({ mensaje: 'Producto eliminado' });
});

module.exports = router;