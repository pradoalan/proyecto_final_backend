const logger = require('../../logger/index');

class ContenedorFileSystem {
    constructor(nombreArchivo) {
        this.nombreArchivo = nombreArchivo;
        this.fs = require('fs');
    }

    async save(objeto) {
        let id = 1;

        try {
            const objetosTxt = await this.fs.promises.readFile(`./models/dataFileSystem/${this.nombreArchivo}`, 'utf-8');
            let arrayObjetos = [];

            if (objetosTxt.length > 0 && objetosTxt != '[]') {
                arrayObjetos = JSON.parse(objetosTxt);
                id = arrayObjetos[arrayObjetos.length - 1].id + 1;
            }

            objeto.timestamp = new Date();
            objeto.id = id;
            arrayObjetos.push(objeto);
            await this.fs.promises.writeFile(`./models/dataFileSystem/${this.nombreArchivo}`, JSON.stringify(arrayObjetos, null, 2));

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
            const objetosTxt = await this.fs.promises.readFile(`./models/dataFileSystem/${this.nombreArchivo}`, 'utf-8');
            let arrayObjetos = [];

            if (objetosTxt.length > 0 && objetosTxt != '[]') {
                arrayObjetos = JSON.parse(objetosTxt);

                const itemIndex = arrayObjetos.findIndex(item => item.id === +id);
                arrayObjetos[itemIndex] = objeto;

                await this.fs.promises.writeFile(`./models/dataFileSystem/${this.nombreArchivo}`, JSON.stringify(arrayObjetos, null, 2));
            }
        } catch (err) {
            logger.error(`Error al actualizar: ${err.message}`);
            return -1;
        }

        return objeto;
    }

    async getById(id) {
        let objeto = null;

        try {
            const objetosTxt = await this.fs.promises.readFile(`./models/dataFileSystem/${this.nombreArchivo}`, 'utf-8');
            let arrayObjetos = [];

            if (objetosTxt.length > 0 && objetosTxt != '[]') {
                arrayObjetos = JSON.parse(objetosTxt);

                for (const obj of arrayObjetos) {
                    if (obj.id == id) {
                        objeto = obj;
                    }
                }
            }
        } catch (err) {
            if (err.code != 'ENOENT') {
                logger.error(`Error al obtener el objeto: ${err.message}`);
                return -1;
            }
        }

        return objeto;
    }

    async getAll() {
        let arrayObjetos = [];

        try {
            const objetosTxt = await this.fs.promises.readFile(`./models/dataFileSystem/${this.nombreArchivo}`, 'utf-8');

            if (objetosTxt.length > 0 && objetosTxt != '[]') {
                arrayObjetos = JSON.parse(objetosTxt);
            }
        } catch (err) {
            if (err.code != 'ENOENT') {
                logger.error(`Error al obtener todos los objetos: ${err.message}`);
                return -1;
            }
        }

        return arrayObjetos;
    }

    async deleteById(id) {
        let eliminado = false;
        
        try {
            const objetosTxt = await this.fs.promises.readFile(`./models/dataFileSystem/${this.nombreArchivo}`, 'utf-8');
            let arrayObjetos = [];

            if (objetosTxt.length > 0 && objetosTxt != '[]') {
                arrayObjetos = JSON.parse(objetosTxt);

                for (let i = 0; i < arrayObjetos.length; i++) {
                    if (arrayObjetos[i].id == id) {
                        arrayObjetos.splice(i, 1);
                        await this.fs.promises.writeFile(`./models/dataFileSystem/${this.nombreArchivo}`, JSON.stringify(arrayObjetos, null, 2));
                        eliminado = true;
                    }
                }
            }
        } catch (err) {
            logger.error(`Error al eliminar el objeto: ${err.message}`);
        }

        return eliminado;
    }

    async addItemToArray(nombreArray, objeto, item) {

        try {

            objeto[nombreArray].push(item);
            
            const objetosTxt = await this.fs.promises.readFile(`./models/dataFileSystem/${this.nombreArchivo}`, 'utf-8');
            let arrayObjetos = [];

            if (objetosTxt.length > 0 && objetosTxt != '[]') {
                arrayObjetos = JSON.parse(objetosTxt);

                const itemIndex = arrayObjetos.findIndex(elemento => elemento.id === objeto.id);
                arrayObjetos[itemIndex] = objeto;

                await this.fs.promises.writeFile(`./models/dataFileSystem/${this.nombreArchivo}`, JSON.stringify(arrayObjetos, null, 2));
            }
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
            
            const objetosTxt = await this.fs.promises.readFile(`./models/dataFileSystem/${this.nombreArchivo}`, 'utf-8');
            let arrayObjetos = [];

            if (objetosTxt.length > 0 && objetosTxt != '[]') {
                arrayObjetos = JSON.parse(objetosTxt);

                const itemIndex = arrayObjetos.findIndex(elemento => elemento.id === objeto.id);
                arrayObjetos[itemIndex] = objeto;

                await this.fs.promises.writeFile(`./models/dataFileSystem/${this.nombreArchivo}`, JSON.stringify(arrayObjetos, null, 2));
            }
        } catch (err) {
            logger.error(`Error al eliminar el item del array: ${err.message}`);
            return false;
        }

        return true;
    }
}

module.exports = ContenedorFileSystem;