const nodemailer = require('nodemailer');
require('dotenv').config();

function generateOPT() {
    const min = 0;
    const max = 9;
    let num = ''

    for (let i = 0; i < 6; i++) {
        num += (Math.floor(Math.random() * (max - min + 1)) + min).toString();
    }

    return num;
}

//todo fix
async function sendOPTVerification(receiverEmail, name, opt) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: true,
        auth: {
          user: process.env.APP_EMAIL,
          pass: process.env.APP_EMAIL_PASSWORD,
        }
      });

    const mailOptions = {
        from: process.env.APP_EMAIL,
        to: receiverEmail,
        subject: 'Verify your email',
        text: 'Hi, your just registered on Whispers with this email, Here is your OPT: ' + opt + '.\n' +'it expires after 5 min',
    };

    try {
        return await transporter.sendMail(mailOptions);
    }
    catch (err) {
        return err;
    }
      
}
 
module.exports = {
    generateOPT,
    sendOPTVerification
}