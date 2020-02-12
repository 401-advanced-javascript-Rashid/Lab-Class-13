'use strict' ;

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const server = express();
server.use(morgan('dev'));
server.use(cors());
server.use(errorHandler);


const timeStamp = (req, res, next) => {
  req.requestTime = new Date();
  if (Date.now) { 
    Date.now = function() { 
      return new Date().getTime(); },
    console.log('The Time:' , req.requestTime.toString());
    next();
  }};

server.use(express.json());
server.use(timeStamp);


function notFoundHandler(req, res, next) {
  res.status(404);
  res.statusMessage = 'Not Found!';
  res.json({ error: 'Not Found'});
}

server.get('/crash-error', (req, res) => {
  throw new Error('Error');
});

function errorHandler(err, req, res, next) {
  res.status(500);
  res.statusMessage = 'Generic Server Error!';
  res.json({ error: err });
}

server.get('/test-error' , (req , res , next) => {
  throw errorHandler();
});


const myAuth = require('../auth-middleware.js');
const theDealer = require('../OAuth.js');
const user = require('../users/users.js');
const transporterAuth = require('../models/bearer-auth-middleware.js');

server.post('/signup' , signUp);
function signUp(req , res){
  return server.saveAfterChecking(req.body)
    .then(info => {
      let token = server.generatorToken(info);
      return token;
    })
    .then(info => {
      res.status(200)
        .send(` Done  ${info}`);
    });
}


server.post('/signin' , myAuth, signIn);
function signIn (req , res){
  res.status(200)
    .send(req.token);
}

server.get('/getAll' , getAllUsers);
async function getAllUsers (req , res){
  res.status(200)
    .json(await user.getAll());
}


server.get('/oauth', theDealer , afterOauth);
function afterOauth(req , res){
  res.status(200).send(`Done ${req.token}`);
}

server.get('/secret' , transporterAuth , (req , res) => {
  if(req.userName){
    res.status(200).send(`The user info : ${req.userName}`);
  }else{
    res.send('Error');
  }
  
});

server.get('*' , notFoundHandler);

module.exports = {
  server: server,
  start: port => {
    let PORT = port || process.env.PORT || 3000;
    server.listen(PORT, () => console.log(`listening on ${PORT}`));
  },

};