const logger = require('../../logger/index');

class ContenedorSQL {
    constructor(configDB, tabla) {
        this.configDB = configDB;
        this.tabla = tabla;
        this.knex = require('knex')(configDB);
    }

    async save(objeto) {
        let newItem = {};

        if (objeto['productos'] != undefined && objeto['productos'].length === 0) {
            objeto = {};
        }

        try {
            newItem = await this.knex(this.tabla).insert(objeto);
            objeto.id = newItem[0];
        } catch (err) {
            logger.error(`Error al guardar: ${err.message}`);
            return -1;
        }

        return objeto;
    }

    async update(id, objeto) {

        try {
            await this.knex.from(this.tabla).where({id}).update(objeto);
            objeto.id = id;
        } catch (err) {
            logger.error(`Error al actualizar: ${err.message}`);
            return -1;
        }

        return objeto;
    }

    async getById(id) {
        let objeto = null;
        let productosId;
        let productos = [];

        try {
            objeto = await this.knex.from(this.tabla).select('*').where('id', '=', id).first();
            if (objeto === undefined) {
                objeto = null;
            } else {
                if (this.tabla === 'carritos') {
                    productosId = await this.knex.from('carrito_productos').select('id_producto').where('id_carrito', '=', id);
                    if (productosId.length > 0) {

                        productosId = productosId.map(a => a.id_producto);

                        let promise = productosId.map(async elementId => {
                            return await this.knex.from('productos').select('*').where('id', '=', elementId).first();
                        });

                        productos = await Promise.all(promise);
                    }
    
                    objeto.productos = productos;
                }
            }
        } catch (err) {
            logger.error(`Error al obtener el item: ${err.message}`);
            return -1;
        }

        return objeto;
    }

    async getAll() {
        let arrayObjetos = [];

        try {
            arrayObjetos = await this.knex.from(this.tabla).select('*');
        } catch (err) {
            logger.error(`Error al obtener todos los items: ${err.message}`);
            return -1;
        }

        return arrayObjetos;
    }

    async deleteById(id) {

        try {
            await this.knex.from(this.tabla).where({id}).del();
        } catch (err) {
            logger.error(`Error al eliminar: ${err.message}`);
            return false;
        }

        return true;
    }

    async addItemToArray(nombreArray, objeto, item) {

        try {
            const newItem = {id_carrito: objeto.id, id_producto: item.id};
            await this.knex('carrito_productos').insert(newItem);
        } catch (err) {
            logger.error(`Error al agregar el item al array: ${err.message}`);
            return false;
        }

        return true;
    }

    async removeItemFromArray(nombreArray, objeto, item) {

        try {
            const itemEliminar = await this.knex.from('carrito_productos').select('*').where({id_carrito: objeto.id, id_producto: item.id}).first();
            
            if (itemEliminar === undefined) {
                return -1;
            }

            await this.knex.from('carrito_productos').where({id: itemEliminar.id}).del();
        } catch (err) {
            logger.error(`Error al eliminar el item del array: ${err.message}`);
            return false;
        }

        return true;
    }
}

module.exports = ContenedorSQL;