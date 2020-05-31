
const mongoose = require('mongoose');
const ObjectId = mongoose.SchemaTypes.ObjectId;

/**
 *  @typedef
 *  {{
 *    _id: string,
 *    player1: string,
 *    player2: string,
 *    winner: string,
 *    namespace: string,
 *    visible: boolean
 *  } & import('mongoose').MongooseDocument}
 *  GameSchema
 */
const GameSchema = new mongoose.Schema({
  player1: {
    type: ObjectId,
    ref: 'Users'
  },
  player2: {
    type: ObjectId,
    ref: 'Users'
  },
  winner: {
    type: ObjectId,
    ref: 'Users'
  },
  namespace: {
    type: String
  },
  visible: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  strict: true
});

GameSchema.set('toJSON', {
  virtuals: true
});

const Game = mongoose.model('Games', GameSchema, 'games');

module.exports = Game;
