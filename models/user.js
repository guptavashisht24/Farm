var mongoose = require('mongoose'); 
var Schema = mongoose.Schema; 
var passportLocalMongoose = require('passport-local-mongoose'); 



var UserSchema = new Schema({   

    email: {type: String, required:true, unique:true}, 

    username : {type: String, unique: true, required:true}, 

    isAdmin : {type: Boolean, required: true, default: false}

}); 

  

// plugin for passport-local-mongoose 

UserSchema.plugin(passportLocalMongoose); 

  

// exporting the userschema 

 module.exports = mongoose.model("User", UserSchema);