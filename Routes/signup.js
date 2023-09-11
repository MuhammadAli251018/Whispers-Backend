
const express = require('express');
const auth_middlewares = require('../MiddleWares/auth_middlewares');
const userDB = require('../DataBase/usersDB');
const idService = require('../Util/idService');
const secretsBD = require('../DataBase/userSecretsDB');
const tempBD = require('../DataBase/tempUserDB');
const verifyCredentialsService = require('../Util/verifyCredintialService');
const tokenService = require('../Util/TokenService');
const router = express.Router();

//todo fix resopones

router.post('/signup/', [auth_middlewares.validateUserSignupInput,
    auth_middlewares.verifyUserIsNotRegistered, auth_middlewares.hashUserPasswords], async (req, res) => {
        
    const {publicId} = idService.getPublicAndPrivateIds();

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
    
        res.status(200).json({publicId});
});


router.post('/verifyEmail/',[auth_middlewares.validateEmailVerificationInput,
 auth_middlewares.verifyEmail], async (req, res) => {

    const user = req.userToAdd

    if (!user) { 
        res.status(500).json({message: 'bad req'});
        return;
    }

    const privateId = idService.getPrivateId(user.publicId);

    await userDB.addUser(
        user.firstName,
        user.lastName,
        user.email,
        user.publicId);
    await secretsBD.addSecret(user.hash, privateId);

    await tempBD.delteTempUser(user.publicId);

    const token = tokenService.generateToken(
        user.firstName + ' ' + user.lastName,
        user.publicId, privateId);
    
    res.status(200).json({code: 0, response: {
        token: token,
        publicId: user.publicId
    } });
})

module.exports = router;