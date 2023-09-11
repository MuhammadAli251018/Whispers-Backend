const jwt = require('jsonwebtoken');

function generateToken(name, publicId, privateId) {
    const payload = {
        name: name,
        publicId: publicId,
    }

    return jwt.sign(payload, privateId, {expiresIn: '30d'})
}

function getIdFromToken(token) {
    const payload = jwt.decode(token);
    return payload.publicId;
}

function verifyToken(token, privateId) {
    return jwt.verify(token, privateId);
}

module.exports = {
    generateToken,
    verifyToken,
    getIdFromToken
}