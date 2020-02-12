'use strict';

const users = require('./users/users.js');
const base64 = require('base-64');

module.exports = async (req , res , next) => {
  let notCorrect = !req.headers.authorization;
  if(notCorrect){ 
    next('Not Correct Try Again');
  }
  let [user , password] = base64.decode(req.headers.authorization.split(' ').pop()).split(':');
  
  users.basicAuth(user , password)
    .then(result => { return users.generatorToken(result);
    })
    .then(data => { 
      req.token = data;
      next();
    })
    .catch(error => 
      next('Wrong Access', error));
};