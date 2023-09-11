const bcrypt = require('bcryptjs');

const saltRound = 10;

async function hashPassword(password) {
    try {
        const hash = await bcrypt.hash(password, saltRound)
        return hash;
    }
    catch (err) {
        console.error(err);
        return err;
    };
}

async function comparePassword(password, hash) {
    try {
        return result = await bcrypt.compare(password, hash)
    }
    catch (err) {
        console.error(err);
        return err;
    };
}

module.exports = {
    hashPassword,
    comparePassword
}