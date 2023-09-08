
const Joi = require('joi');
const userDB = require('../DataBase/usersDB')
const tempUserDB = require('../DataBase/tempUserDB')
const hashingService = require('../Util/hashingService')

async function validateUserSignupInput(req, res, next) {
    try {
        let schema = Joi.object({
            firstName: Joi.string().alphanum().max(20).min(2).required(),
            lastName: Joi.string().alphanum().max(20).min(2).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/)
        });

        req.newUser = await schema.validateAsync(req.body);
        next();
        }
    catch (err) {
        res.status(400).json(err);
    }
}

async function validateEmailVerificationInput(req, res, next) {
    try {
        let schema = Joi.object({
            publicId: Joi.required(),
            opt: Joi.number()
        });

        req.emailVerification = await schema.validateAsync(req.body);

        next();
        }
    catch (err) {
        res.status(400).json(err);
    }
}

async function verifyEmail(req, res, next) {
    const verification = req.emailVerification;
    
    console.log('stage 1');

    try {
        const userInfo = await tempUserDB.getUserTempById(verification.publicId)

        if (!userInfo) {
            res.status(400).json({ message: 'Invalid Id'})
        }

        console.log('stage 2');

        req.userToAdd = {
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            email: userInfo.email,
            publicId: userInfo.publicId,
            hash: userInfo.hash
        }

        console.log(req.userToAdd);

        
        next();

        /*if(userInfo.remainVerificaton > 0) {
            tempUserDB.incrementRemainVerificationsById(userInfo.publicId);

            if(userInfo.emailVerificationOpt === verification.opt) {
                //res.status(200).json({ message: 'Email verified successfully'});
                req.userToAdd = {
                    firstName: userInfo.firstName,
                    lastName: userInfo.lastName,
                    email: userInfo.email,
                    publicId: userInfo.publicId,
                    hash: userInfo.hash
                }
                next();
            }
            else {
                res.status(400).json({ message: 'Invalid Email Verification'});
            }
        }
        else {
            tempUserDB.delteTempUser(userInfo.publicId);
            res.status(400).json({ message: 'Invalid Email Verification'});
        }*/

    }
    catch(err) {
        res.status(500).json({ message: 'Somtheing went wrong' });
    };
}


async function hashUserPasswords(req, res, next) {
    
    try {
        const hash = await hashingService.hashPassword(req.newUser.password);

        if (!hash ) {
            res.status(500).send('something went wrong');
        }

        req.newUser.password = hash;
        next();
    }
    catch (err) {
        console.error(err);
        res.status(500).send('something went wrong');
    };
}

//verify user don't exist in DB

async function verifyUserIsNotRegistered(req, res, next) {
    try {
        user = await userDB.getUserByEmail(req.newUser.email);
        if (user) {
            res.status(400).send('User is already registered')
        }
        else {        
            next();
        }
    }
    catch (err) {
        res.status(400).json(err);
    }
    
}

module.exports = {
    validateUserSignupInput,
    validateEmailVerificationInput,
    verifyUserIsNotRegistered,
    hashUserPasswords,
    verifyEmail
};