const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    hash: String,
    privateId: String
},
{collection: 'UserSecrets'})

const UserSecret = mongoose.model('UserSecrets', schema)

async function addSecret(hash, privateId) {
    try {
        const userSecrets = new UserSecret({hash, privateId});
        res = await userSecrets.save();
        //console.log(res);
        return res.privateId;
    }
    catch (err) {
        console.log(err);
        return err;
    };
}

async function getSecretById(privateId) {
    try {
        return await UserSecret.findOne({ privateId: privateId });
    }
    catch (err) {
        console.log(err);
        return err;
    };
}

// the function don't provide to update user id and it should be persistant
async function updateSecret(newHash, privateId) {
    try {
        const userSecret = await UserSecret.findOne({ privateId: privateId});
        if (!userSecret) return;

        userSecret.hash = newHash;

        await userSecret.save();
        return true;
    }
    catch (err) {
        console.log(err);
        return err;
    };
}

module.exports = {
    UserSecrets: UserSecret,
    addSecret: addSecret,
    updateSecret: updateSecret,
    getSecretById: getSecretById,
}
