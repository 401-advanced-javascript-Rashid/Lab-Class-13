'use strict'; 

const users = require('./users/users.js');

module.exports = (req , res , next)=> {
    
  if(!req.headers.authorization){
    next('Missing!! ( Authorization Data ) ');
    return ;
  }

  users.tokenVali(req.headers.authorization.split(' ').pop())
    .then(info => {
      req.userName = info;
      next();
    }).catch(
      error => next(error));
};