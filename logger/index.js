const winston = require('winston');

//Filtramos mensajes de error
const errorFilter = winston.format((info, opts) => { 
	return info.level === 'error' ? info : false 
});

//Filtramos mensajes de warn
const warnFilter = winston.format((info, opts) => { 
	return info.level === 'warn' ? info : false 
});

const logger = winston.createLogger({
    level: 'info',
    transports: [ 
        new winston.transports.Console({
            level: 'info', 
            format: winston.format.combine(
            winston.format.colorize({
                all: true,
                colors: {
                    info: 'blue',
                    warn: 'yellow',
                    error: 'red'
                }
            }),
            winston.format.align(),
            winston.format.timestamp(), 
            winston.format.printf(info => `${info.timestamp} [${info.level}] => ${info.message}`)
        ),
        }),
        new winston.transports.File({
            level: 'warn',
            filename: './logger/warn.log',
            format: winston.format.combine(
                warnFilter(),
                winston.format.align(),
                winston.format.timestamp(),
                winston.format.printf(i => `${i.timestamp} [${i.level}] => ${i.message}`)
            ),
        }),
        new winston.transports.File({
            level: 'error',
            filename: './logger/error.log',
            format: winston.format.combine(
                errorFilter(),
                winston.format.align(),
                winston.format.timestamp(),
                winston.format.printf(i => `${i.timestamp} [${i.level}] => ${i.message}`)
            ),
        })
    ]
});

module.exports = logger;