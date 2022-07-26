const { getFirestore } = require('firebase-admin/firestore');
const { admin } = require('../../db/firebase/firebase.config');
const logger = require('../../logger/index');

class ContenedorFirebase {
    constructor(coll) {
        const db = getFirestore();
        this.query = db.collection(coll);
    }

    async save(objeto) {

        try {
            objeto.timestamp = new Date();
            const docRef = this.query.doc();
            await docRef.set(objeto);
            objeto.id = docRef.id;

        } catch (err) {
            logger.error(`Error al guardar: ${err.message}`);
            return -1;
        }

        return objeto;
    }

    async update(id, objeto) {

        try {
            const docRef = this.query.doc(id);
            await docRef.update(objeto);
            objeto.id = docRef.id;
        } catch (err) {
            logger.error(`Error al actualizar: ${err.message}`);
            return -1;
        }

        return objeto;
    }

    async getById(id) {
        let objeto = null;

        try {
            const docRef = this.query.doc(id);
            const document = await docRef.get();
            if (document.data() !== undefined) {
                objeto = document.data();
                objeto.id = docRef.id;
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
            const docRef = await this.query.get();
            const documents = docRef.docs;
            arrayObjetos = documents.map(document => ({ 
              ...document.data(),
              id: document.id
            }));
        } catch (err) {
            logger.error(`Error al obtener todos los items: ${err.message}`);
            return -1;
        }

        return arrayObjetos;
    }

    async deleteById(id) {

        try {
            const docRef = this.query.doc(id);
            await docRef.delete();
        } catch (err) {
            logger.error(`Error al eliminar: ${err.message}`);
            return false;
        }

        return true;
    }

    async addItemToArray(nombreArray, objeto, item) {

        try {
            objeto[nombreArray].push(item);

            const docRef = this.query.doc(objeto.id);
            await docRef.update(objeto);
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

            const docRef = this.query.doc(objeto.id);
            await docRef.update(objeto);
        } catch (err) {
            logger.error(`Error al eliminar el item del array: ${err.message}`);
            return false;
        }

        return true;
    }
}

module.exports = ContenedorFirebase;