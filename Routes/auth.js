const express = require('express');
const router = express.Router();
const {validateUserLoginInput, verifyUserIsRegistered, compareLoginUserCredintials} = require('../MiddleWares/auth_middlewares');
const {generateToken} = require('../Util/TokenService');

router.post('/login/', [validateUserLoginInput, verifyUserIsRegistered, compareLoginUserCredintials], async (req, res) => {
    const data = req.userCredintials;
    const token = generateToken(data.name, data.publicId, data.privateId);

    res.status(200).json({token: token, publicId: data.publicId});
});

module.exports = router;