const logger = require('../../logger/index');

class ContenedorMemory {
    constructor(array) {
        this.list = array;
    }

    async save(objeto) {
        let id = 0;
        if(this.list.length > 0) {
            id = this.list[this.list.length -1].id;
        }

        try {
            objeto.timestamp = new Date();
            objeto.id = id+1;
            this.list.push(objeto);
        } catch (err) {
            logger.error(`Error al guardar: ${err.message}`);
            return -1;
        }

        return objeto;
    }

    async update(id, objeto) {
        objeto.timestamp = new Date();
        objeto.id = +id;

        try {
            const itemIndex = this.list.findIndex(item => item.id === +id);
            if (itemIndex === -1) {
                return -1;
            }

            this.list[itemIndex] = objeto;
        } catch (err) {
            logger.error(`Error al actualizar: ${err.message}`);
            return -1;
        }

        return objeto;
    }

    async getById(id) {
        let objeto = null;

        try {
            const itemIndex = this.list.findIndex(item => item.id === +id);
            if (itemIndex === -1) {
                return objeto;
            }

            objeto = this.list[itemIndex];
        } catch (err) {
            logger.error(`Error al obtener el objeto: ${err.message}`);
            return -1;
        }

        return objeto;
    }

    async getAll() {
        let arrayObjetos = [];

        try {
            if (this.list.length > 0) {
                arrayObjetos = this.list;
            }
        } catch (err) {
            logger.error(`Error al obtener todos los objetos: ${err.message}`);
            return -1;
        }

        return arrayObjetos;
    }

    async deleteById(id) {

        try {
            const itemIndex = this.list.findIndex(item => item.id === +id);
            if (itemIndex === -1) {
                return false;
            }

            this.list.splice(itemIndex, 1);
        } catch (err) {
            logger.error(`Error al eliminar el objeto: ${err.message}`);
            return false;
        }

        return true;
    }

    async addItemToArray(nombreArray, objeto, item) {

        try {
            objeto[nombreArray].push(item);

            const itemIndex = this.list.findIndex(elemento => elemento.id === objeto.id);
            if (itemIndex === -1) {
                return -1;
            }

            this.list[itemIndex] = objeto;
        } catch (err) {
            logger.error(`Error al agregar el item al array: ${err.message}`);
            return false;
        }

        return true;
    }

    async removeItemFromArray(nombreArray, objeto, item) {
        
        try {

            const itemIndexEliminar = objeto[nombreArray].findIndex(elemento => elemento.id === item.id);
            if (itemIndexEliminar === -1) {
                return -1;
            }
            objeto[nombreArray].splice(itemIndexEliminar, 1);

            const itemIndex = this.list.findIndex(elemento => elemento.id === objeto.id);
            this.list[itemIndex] = objeto;
        } catch (err) {
            logger.error(`Error al eliminar el item del array: ${err.message}`);
            return false;
        }

        return true;
    }
}

module.exports = ContenedorMemory;