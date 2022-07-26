const twilio = require('twilio');
const env = require('../env.config');
const logger = require('../logger/index');

const twilioClient = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_ACCOUNT_TOKEN);

const enviarWhatsapp = async (destinatario, mensaje) => {
    try {
        const messagePayload = {
            from: env.TWILIO_NUMBER_WHATSAPP, 
            to: `whatsapp:${destinatario}`,
            body: mensaje
        };

        const messageResponse = await twilioClient.messages.create(messagePayload);
    } catch (error) {
        logger.error(error);
    }
}

module.exports = {
    enviarWhatsapp
};