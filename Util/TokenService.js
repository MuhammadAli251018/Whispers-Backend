const jwt = require('jsonwebtoken');

function generateToken(name, publicId, privateId) {
    const payload = {
        name: name,
        publicId: publicId,
    }

    expiereTime = Date.now() + (1000 * 60 * 60 * 24 * 30) // 30 Days;

    return token = jwt.sign(payload, privateId, {expiresIn: '30d'})
}

function verifyToken(token, privateId) {
    return jwt.verify(token, privateId);
}

module.exports = {
    generateToken,
    verifyToken
}