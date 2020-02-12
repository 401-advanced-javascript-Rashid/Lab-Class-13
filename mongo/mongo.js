'use strict';

class Mongo {
  constructor(schema){
    this.schema = schema ;
  }
    
  read(name){
    if(name){let findName = this.schema.find({name});
      return findName;
    } else {let empty = this.schema.find({});
      return empty;
    }
  }
  create(value){
    return new this.schema(value).save();
  }
  update(_id , value){
    let find_id = this.schema.findByIdAndUpdate(_id , value , {new : true});
    return find_id;
  }
  delete(_id){
    return this.schema.findOneAndDelete(_id); 
  }
}
module.exports = Mongo ;