const dbconfig = require('./config');
const knex = require('knex')(dbconfig.mariaDB);
const logger = require('../../logger/index');

(async () => {
    try {

        //Productos
        let tableExist = await knex.schema.hasTable('productos');
        if (!tableExist) {
            await knex.schema.createTable('productos', (table) => {
                table.increments('id');
                table.timestamp('timestamp').defaultTo(knex.fn.now());
                table.string('nombre').notNullable();
                table.string('descripcion').notNullable();
                table.string('codigo').notNullable().unique();
                table.string('fotoUrl');
                table.decimal('precio', 13, 2).notNullable().unsigned();
                table.integer('stock').notNullable().unsigned();
            });
            logger.info('Tabla "productos" creada satisfactoriamente');
        } else {
            logger.info('La tabla "productos" existe actualmente');
        }

        //Carritos
        tableExist = await knex.schema.hasTable('carritos');
        if (!tableExist) {
            await knex.schema.createTable('carritos', (table) => {
                table.increments('id');
                table.timestamp('timestamp').defaultTo(knex.fn.now());
            });
            logger.info('Tabla "carritos" creada satifactoriamente ');
        } else {
            logger.info('La tabla "carritos" existe actualmente');
        }

        //Carrito_productos
        tableExist = await knex.schema.hasTable('carrito_productos');
        if (!tableExist) {
            await knex.schema.createTable('carrito_productos', (table) => {
                table.increments('id');
                table.integer('id_carrito').unsigned().references('id').inTable('carritos');
                table.integer('id_producto').unsigned().references('id').inTable('productos');
            });
            logger.info('Tabla "carrito_productos" creada satisfactoriamente');
        } else {
            logger.info('La tabla "carrito_productos" existe actualmente');
        }
        
    } catch (error) {
        logger.error(error);
        throw error;
    }
    finally {
        //Desxonexion con la BD
        knex.destroy();
    }
})();
