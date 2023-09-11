const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    emailVerificationOpt: String,
    remainVerificaton: Number,
    publicId: String,
    hash: String,
},
{collection: 'tempUserInfo',})

const TempUserInfo = mongoose.model('TempUser', schema)

async function addUser(firstName, lastName, email, emailVerificationOpt, publicId, hash) {
    try {
        const user = new TempUserInfo({firstName, lastName, email, emailVerificationOpt, remainVerificaton: 10, publicId, hash});
        res = await user.save();
        console.log(res);
        return res.publicId;
    }
    catch (err) {
        console.log(err);
        return err;
    };
}

async function getUserById(publicId) {
    try {
        return userInfo = await TempUserInfo.findOne({ publicId: publicId});
    }
    catch (err) {
        console.log(err);
        return err;
    };
}

async function incrementRemainVerificationsById(publicId) {
    try {
        const userInfo = await TempUserInfo.findOne({ publicId: publicId});
        userInfo.remainVerificaton -= 1;

        await userInfo.save();
    }
    catch (err) {
        console.log(err);
        return err;
    };
}


async function deleteUser(publicId) {
    try {
        const userInfo = await TempUserInfo.findOneAndDelete({ publicId: publicId});
        if (!userInfo) return;

        return true;
    }
    catch (err) {
        console.log(err);
        return err;
    };
}

module.exports = {
    UserTempInfo: TempUserInfo,
    addTempUser: addUser,
    delteTempUser: deleteUser,
    getUserTempById: getUserById,
    incrementRemainVerificationsById
}
