const nodemailer = require('nodemailer');
const env = require('../env.config');
const logger = require('../logger/index');

const enviarEmail = async (destinatario, asunto, mensaje) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        auth: {
            user: env.GMAIL_FROM_SEND,
            pass: env.GMAIL_PASS_APPLICATION
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const mailOptions = {
        from: 'Node JS Server',
        to: destinatario,
        subject: asunto, 
        text: mensaje
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        logger.error(error);
    }
};

module.exports = {
    enviarEmail
};