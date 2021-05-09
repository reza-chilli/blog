const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    f_name : {
        type : String,
        required : true,
        trim : true
    },
    l_name : {
        type : String,
        required : true,
        trim : true
    },
    username : {
        type : String,
        required : true,
        trim : true
    },
    password : {
        type : String,
        required : true,
        trim : true
    },
    phonenumber : {
        type : String,
        required : true,
        trim : true
    },
    avatar : {
        type : String,
        default : '',
        trim : true
    },
    gender : {
        type : String,
        trim : true,
        enum: ['male', 'female']
    },
    role : {
        type : String,
        default : 'blogger'
    }
});

userSchema.pre('save', function(next) {
    const user = this;
    if (this.isNew || this.isModified('password')) {
      bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function(err, hash) {
          if (err) return next(err);
          user.password = hash;
          return next();
        });
    });
    } else {
      return next();
    }
  })

module.exports = mongoose.model('User', userSchema);