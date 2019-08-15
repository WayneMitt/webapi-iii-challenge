const express = require('express');

const server = express();

const Router = require('./users/userRouter')


//Middleware
server.use(express.json());

server.use(logger);

server.use('/api/users', Router);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});

//custom middleware

function logger(req, res, next) {
  console.log(`${req.method} Request, URL:${req.originalUrl}, Time: ${Date.now()}`);
  next();
};

module.exports = server;
