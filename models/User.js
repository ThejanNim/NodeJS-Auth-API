const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { ROLE_ADMIN, ROLE_MEMBER, ROLE_MERCHANT } = require('../constants');

const userSchema = new Schema({
    name:{
       type: String,
       required: true
    },
    email: {
       type: String,
       required: true
    },
    password: {
       type: String,
       required: true
    },
    role: {
      type: String,
      default: ROLE_MEMBER,
      enum: [ROLE_ADMIN, ROLE_MEMBER, ROLE_MERCHANT]
    }
 },{
    timestamps: true,
    collection: 'users'
 })
 module.exports = mongoose.model('User', userSchema);