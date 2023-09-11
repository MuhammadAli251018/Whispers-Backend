const express = require('express');
const signupRouter = require('./Routes/signup');
const loginRouter = require('./Routes/auth');
const mongoose = require('mongoose');
require('dotenv').config();
const {handleUpgrade} = require('./websockets');

const app = express();
const http = require('http');
const server = http.createServer(app);
app.server = server;

mongoose.connect("mongodb://localhost:27017/users")
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

app.use(express.json());
app.use('/auth/', signupRouter);
app.use('/auth/', loginRouter);

server.on('upgrade', (req, socket, head) => {
  handleUpgrade(req, socket, head);
});

server.listen(3000, () => {
    console.log('app listening on http://localhost:3000');
});
