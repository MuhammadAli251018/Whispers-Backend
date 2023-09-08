//Resposiplities of the file
// 1- Verify user does not exist in DB
// 2- Verify user Email
// 3- Add User to DB
// 4- Generate Token for the user

const express = require('express');
const auth_middlewares = require('../MiddleWares/auth_middlewares');
const userDB = require('../DataBase/usersDB');
const idService = require('../Util/idService');
const secretsBD = require('../DataBase/userSecretsDB');
const tempBD = require('../DataBase/tempUserDB');
const verifyCredentialsService = require('../Util/verifyCredintialService');
const router = express.Router();


router.post('/', [auth_middlewares.validateUserSignupInput,
    auth_middlewares.verifyUserIsNotRegistered, auth_middlewares.hashUserPasswords], async (req, res) => {

        //generate hash for user's password
        // add user to DB and send the token
        
    const {publicId, privateId} = idService.getPublicAndPrivateIds();

    const opt = verifyCredentialsService.generateOPT();
    await tempBD.addTempUser(req.newUser.firstName,
        req.newUser.lastName,
        req.newUser.email,
        opt,
        publicId,
        req.newUser.password
        );

        /*await verifyCredentialsService.sendOPTVerification(
            req.newUser.email,
            req.newUser.firstName + req.newUser.lastName,
            opt);*/
    
        res.status(200).json({message: 'Registered successfully'});
});


router.post('/verifyEmail/',[auth_middlewares.validateEmailVerificationInput,
 auth_middlewares.verifyEmail], async (req, res) => {

    const user = req.userToAdd

    console.log('stage 3');

    if (!user) { 
        res.status(500).json({message: 'bad req'});
        console.log('stage 4');
        return;
    }
    console.log('stage 5');

    const privateId = idService.getPrivateId(user.publicId);


    await userDB.addUser(
        user.firstName,
        user.lastName,
        user.email,
        user.publicId);
        console.log('stage 6');
    await secretsBD.addSecret(user.hash, privateId);

    await tempBD.delteTempUser(user.publicId);

    console.log('stage 7');
    res.status(200).json({ message: `registered sucessfully verify email`, user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        publicId: user.publicId
    } });
})

module.exports = router;