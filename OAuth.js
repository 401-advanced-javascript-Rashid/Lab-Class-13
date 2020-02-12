'use strict';


require('dotenv').config();
const superagent = require('superagent');
const users = require('./users/users.js');

const access_token = 'https://github.com/login/oauth/access_token' ;
const api = 'https://api.github.com/user' ;
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = 'http://localhost:3000/oauth';


module.exports= async function theDealer(req , res , next){
  try{
    let code = req.query.code ;
    console.log('github Code:', code);
  
    let githubToken = await getToken(code) ;
    console.log('github token:', githubToken);
  
    let githubData = await getInfo(githubToken) ;
    console.log('github data:', githubData);
  
    let modifiedUserData = await saveAndGet(githubData);
    console.log('hashed and token:', modifiedUserData);
  
    let token = modifiedUserData[1] ;
    let user = modifiedUserData[0] ;
  
    req.token = token ;
    req.user = user ;
    next();

  }catch(error){
    console.error(error);
  }
};

async function getToken(code){

  let res = await superagent.post(access_token).send({
    code: code ,
    client_id: client_id,
    client_secret: client_secret,
    redirect_uri: redirect_uri,
    state: 'Authorization',
  });

  return res.body.access_token;
}

async function getInfo(access_token){
  let data = await superagent.get(api)
    .set('user-agent' , 'express-app')
    .set('Authorization' , `token ${access_token}`);

  return data.body ;
}

async function saveAndGet(data){
  let userData = {
    name : data.login ,
    password : 'qwertyuiop',
  };

 
  return [ 
    await users.saveAfterChecking(userData), 
    await users.generatorToken(userData),
  ];
}


