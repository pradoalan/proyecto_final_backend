const admin = require('firebase-admin');
const serviceAccount = require('./firebase.config.json');
const logger = require('../../logger/index');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
logger.info('Firestore connection is on');

module.exports.admin = admin;