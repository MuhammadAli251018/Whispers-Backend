const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    publicId: String,
},
{collection: 'usersinfo',})

const User = mongoose.model('Users', schema)

async function addUser(firstName, lastName, email, publicId) {
    try {
        const user = new User({firstName, lastName, email, publicId});
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
        return userInfo = await User.findOne({ publicId: publicId});
    }
    catch (err) {
        console.log(err);
        return err;
    };
}

async function getUserByEmail(email) {
    try {
        return userInfo = await User.findOne({ email: email });
    }
    catch (err) {
        console.log(err);
        return err;
    };
}


// the function don't provide to update user id and it should be persistant
async function updateUser(firstName, lastName, publicId) {
    try {
        const userInfo = await User.findOne({ publicId: publicId});
        if (!userInfo) return;

        userInfo.firstName = firstName;
        userInfo.lastName = lastName;

        await userInfo.save();
        return true;
    }
    catch (err) {
        console.log(err);
        return err;
    };
}

module.exports = {
    User: User,
    addUser: addUser,
    updateUser: updateUser,
    getUserById: getUserById,
    getUserByEmail: getUserByEmail
}
