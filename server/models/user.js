const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        maxLength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
      type: String,
      minlength: 5
    },
    lastname: {
        type: String,
        maxLength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

userSchema.pre('save', function(next){
    const user = this;
    console.log(this);
    if(user.isModified('password')) {
        //비밀번호 암호화
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if (err) return next(err);
            const myPlaintextPassword =
                bcrypt.hash(user.password, salt, (err, hash) => {
                    if (err) return next(err);
                    user.password = hash;
                    next();
                });
        })
    } else {
        next();
    }
});

userSchema.methods.comparePassword = function(plainPassword, cb) {
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err);
        cb(null, isMatch);
    })
}

userSchema.methods.generateToken =function(cb) {
    const user = this;
    const token = jwt.sign(user._id.toHexString(), 'secretToken');
    user.token = token;
    user.save(function(err, user){
        if(err) return cb(err);
        cb(null,user);
    })
}

userSchema.statics.findByToken = function(token, cb) {
    var user = this;

    //token 복호화
    jwt.verify(token, 'secretToken', function(err, decoded){
        user.findOne({"_id": decoded, "token":token}, function(err, user){
            if(err) return cb(err);
            cb(null, user);
        });
    })
}

const User = mongoose.model('User', userSchema);

module.exports = {User}