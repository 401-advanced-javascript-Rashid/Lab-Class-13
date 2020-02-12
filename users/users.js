'use strict';

const Model = require('./user-model.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let users = {} ;
users.save = async function (info){
  let search;
  let found = await Model.read(info.name);
  if(found){
    search =await Model.read(info.name)[0].name ;
  }
  let notFound = !( search === info.name);
  if(notFound){
    info.password = await bcrypt.hash(info.password , 10);
    await Model.create(info);
    return info ;
  } else {
    return info;
  }
};

users.tokenGenerator = async function(data){
  try{
    return await jwt.sign({user: `${data.name}`}, 'SECRET' , {expiresIn: '18m'});
  } catch(error) {
    return Promise.reject(error);
  }
};

users.basicAuth = async function(user , pass){
  let searchTheDB = await Model.read(user);
  if(await bcrypt.compare(pass , searchTheDB[0].password)){
    return searchTheDB[0];
  }else{
    return Promise.reject ;
  }
};

users.showAll = async function(){
  return Model.read();
};

users.ValidatToken= async function(token){
  try {
    let searchResult = await Model.read(info.user);
    let info = await jwt.verify(token , 'SECRET');
    if(searchResult[0]){
      return searchResult[0];
    }else{
      return 'Hmmmmmmmmmm';
    }
  }catch(error){
    return Promise.reject(error); 
  }
};

module.exports = users ;