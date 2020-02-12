'use strict'; 

const users = require('./users/users.js');

module.exports = (req , res , next)=> {
    
  if(!req.headers.authorization){
    next('Authorization Data Missing!!');
    return ;
  }

  users.tokenValidator(req.headers.authorization.split(' ').pop())
    .then(data => {
      req.userName = data;
      next();
    }).catch(
      error => next(error));
};