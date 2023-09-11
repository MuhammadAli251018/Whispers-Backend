
const Joi = require('joi');
const userDB = require('../DataBase/usersDB')
const userSecretsDB = require('../DataBase/userSecretsDB');
const tempUserDB = require('../DataBase/tempUserDB')
const idService = require('../Util/idService')
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

async function validateUserLoginInput(req, res, next) {
    try {
        console.log('stag1');
        let schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required()
        });

        req.userCredintials = await schema.validateAsync(req.body);
        next();
        }
    catch (err) {
        res.status(400).json(err);
    }
}

async function verifyUserIsRegistered(req, res, next) {
    try {
        console.log('stag2');

        const user = await userDB.getUserByEmail(req.userCredintials.email);
        console.log(user);
        if (user) {
            req.userCredintials.hash = await userSecretsDB.getSecretById(idService.getPrivateId(user.publicId));
            req.userCredintials.name = user.firstName + ' ' + user.lastName;
            req.userCredintials.publicId = user.publicId;
            req.userCredintials.privateId = idService.getPrivateId(user.publicId);
            next();
        }
        else {        
            
            res.status(400).send('User is not registered');
        }
    }
    catch (err) {
        res.status(400).json(err);
    }
    
}


async function compareLoginUserCredintials(req, res, next) {
    
    try {
        console.log('stag3');
        const result = hashingService.comparePassword(req.userCredintials.password, req.userCredintials.hash)
        if (result ) {
            next();
        }
        else {
            res.status(400).json({message: 'Invalid password'})
        }

    }
    catch (err) {
        console.error(err);
        res.status(500).send('something went wrong');
    };
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
    
    try {
        const userInfo = await tempUserDB.getUserTempById(verification.publicId)

        if (!userInfo) {
            res.status(400).json({ message: 'Invalid Id'})
        }

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
        const user = await userDB.getUserByEmail(req.newUser.email);
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
    verifyEmail,
    validateUserLoginInput,
    verifyUserIsRegistered,
    compareLoginUserCredintials
};