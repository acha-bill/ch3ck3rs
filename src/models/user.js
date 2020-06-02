const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const ObjectId = mongoose.SchemaTypes.ObjectId;

/**
 *  @swagger
 *  components:
 *    schemas:
 *      User:
 *        type: object
 *        properties:
 *          id:
 *            type: string
 *          userName:
 *            type: string
 *          fullName:
 *            type: string
 *          password:
 *            type: string
 */

/**
 *  @typedef
 *  {{
 *    _id: string,
 *    userName: string,
 *    fullName: string,
 *    photoURL: string,
 *    password: string,
 *    games: Array
 *  } & import('mongoose').MongooseDocument}
 *  UserSchema
 */
const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  fullName: {
    type: String,
    trim: true
  },
  photoURL: {
    type: String,
    default: 'https://img.icons8.com/color/96/000000/cat-profile.png'
  },
  password: {
    type: String,
    required: true
  },
  games: [{
    type: ObjectId,
    ref: 'Game'
  }]
}, {
  timestamps: true,
  strict: true
});

UserSchema.post('save', async function (user, next) {
  const password = bcrypt.hashSync(user.password, saltRounds);
  await mongoose.model('User').findByIdAndUpdate(user._id, {
    password
  });
  next();
});

UserSchema.set('toJSON', {
  virtuals: true
});

const User = mongoose.model('User', UserSchema, 'users');

module.exports = User;
