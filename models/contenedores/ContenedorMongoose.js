const mongoose = require('mongoose');
const logger = require('../../logger/index');
const configDB = require('../../db/config');

const DATABASE = 'ecommerce';
const URI = configDB.mongodb.connectTo(DATABASE);

class ContenedorMongoose {
    constructor(collection, schema) {
        this.model = mongoose.model(collection, schema);
    }

    async conectarDB () {
        await mongoose.connect(URI);
    }

    async desconectarDB () {
        await mongoose.disconnect();
    }

    async save(objeto) {
        let newItem = {};

        if (objeto['productos'] != undefined && objeto['productos'].length === 0) {
            objeto = {};
        }
        
        try {
            await this.conectarDB();
            newItem = await this.model.create(objeto);
            await this.desconectarDB();
        } catch (err) {
            logger.error(`Error al guardar: ${err.message}`);
            return -1;
        }

        return newItem;
    }

    async update(id, objeto) {
        let updatedItem = {};

        try {
            await this.conectarDB();
            updatedItem = await this.model.findByIdAndUpdate({_id: id}, objeto, {new: true});
            await this.desconectarDB();
        } catch (err) {
            logger.error(`Error al actualizar: ${err.message}`);
            return -1;
        }

        return updatedItem;
    }

    async getById(id) {
        let objeto = null;

        if (!mongoose.isValidObjectId(id)) {
            return null;
        }

        try {
            await this.conectarDB();
            objeto = await this.model.findOne({_id: id}, {__v: 0});
            await this.desconectarDB();
        } catch (err) {
            logger.error(`Error al obtener el item: ${err.message}`);
            return -1;
        }

        return objeto;
    }

    async getAll() {
        let arrayObjetos = [];

        try {
            await this.conectarDB();
            arrayObjetos = await this.model.find({}, {__v: 0}).lean();
            await this.desconectarDB();
        } catch (err) {
            logger.error(`Error al obtener todos los items: ${err.message}`);
            return -1;
        }

        return arrayObjetos;
    }

    async deleteById(id) {

        try {
            await this.conectarDB();
            await this.model.deleteOne({_id: id});
            await this.desconectarDB();
        } catch (err) {
            logger.error(`Error al eliminar: ${err.message}`);
            return false;
        }

        return true;
    }

    async addItemToArray(nombreArray, objeto, item) {

        try {
            objeto[nombreArray].push(item);

            await this.conectarDB();
            await this.model.findByIdAndUpdate({_id: objeto.id}, objeto, {new: true});
            await this.desconectarDB();
        } catch (err) {
            logger.error(`Error al agregar el item al array: ${err.message}`);
            return false;
        }

        return true;
    }

    async removeItemFromArray(nombreArray, objeto, item) {

        try {

            const itemIndexEliminar = objeto[nombreArray].findIndex(elemento => elemento._id.toString() == item._id.toString());
            if (itemIndexEliminar === -1) {
                return -1;
            }
            objeto[nombreArray].splice(itemIndexEliminar, 1);
            
            await this.conectarDB();
            await this.model.findByIdAndUpdate({_id: objeto.id}, objeto, {new: true});
            await this.desconectarDB();
        } catch (err) {
            logger.error(`Error al eliminar el item del array: ${err.message}`);
            return false;
        }

        return true;
    }
}

module.exports = ContenedorMongoose;