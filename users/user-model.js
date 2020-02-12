'use strict';

const Mongo = require('../mongo/mongo.js');
const schema = require('./users-schema.js');

class UserModel extends Mongo{
  constructor(){
    super(schema);
  }
}

module.exports= new UserModel ;