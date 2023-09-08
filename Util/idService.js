
const {v4: uuidv4} = require('uuid');
const crypto = require('crypto');
require('dotenv').config();


function getPublicAndPrivateIds() {
    const publicId = uuidv4();
    const algorithm = 'aes-256-cbc'; // AES encryption with a 256-bit key in CBC mode
    const key = Buffer.from(process.env.IDS_ENCRYPITION_KEY, 'hex')
    const iv = Buffer.from(process.env.IDS_ENCRYPITION_IV, 'hex');
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const privateId = cipher.update(publicId, 'utf8', 'hex') + cipher.final('hex');

    return {publicId: publicId, privateId: privateId}
}

function getPrivateId(publicId) {
    const algorithm = 'aes-256-cbc'; // AES encryption with a 256-bit key in CBC mode
    const key = Buffer.from(process.env.IDS_ENCRYPITION_KEY, 'hex')
    const iv = Buffer.from(process.env.IDS_ENCRYPITION_IV, 'hex');
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    return cipher.update(publicId, 'utf-8', 'hex') + cipher.final('hex');
}

module.exports = {
    getPublicAndPrivateIds,
    getPrivateId
}