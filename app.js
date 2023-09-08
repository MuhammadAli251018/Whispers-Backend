const express = require('express');
const signupRouter = require('./Routes/signup');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();

mongoose.connect("mongodb://localhost:27017/users")
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

app.use(express.json());
app.use('/auth/signup', signupRouter);

app.listen(3000, () => {
    console.log('app listening on http://localhost:3000');
});
