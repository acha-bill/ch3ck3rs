const { makeid } = require('../utils/methods');
const GameModel = require('../models/game');
const GenericCrudService = require('./generic-crud-service');
const ioService = require('./io');
const Board = require('./board');

const sockMap = new Map();
const boardMap = new Map();
const inviteMap = new Map();

class GameService extends GenericCrudService {
  constructor () {
    super(GameModel);
  }

  /**
 * Stars a new game.
 * @param {User} user
 * @param {Boolean} visible
 */
  async newGame (user, visible) {
    try {
      const namespace = makeid(24);
      const game = await super.create({
        player1: user,
        namespace,
        visible
      });

      const nsp = ioService.getOrCreateNamespace(namespace);
      nsp.on('connection', handleConnection);
      return game;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async getOnlineUsers (game) {
    const nspc = ioService.getOrCreateNamespace(game.namespace);
    nspc.clients((err, sockIds) => {
      if (err) { throw err; }
      return sockIds;
    });
  }

  async inviteToGame (game, from, to, message) {
    let toSocketId;
    let fromSocketId;
    for (const [sockId, userId] of sockMap.entries()) {
      if (userId === to.id) { toSocketId = sockId; }
      if (userId === from.id) { fromSocketId = sockId; }
      if (toSocketId && fromSocketId) {
        break;
      }
    }
    const socket = ioService.getSocketById(toSocketId);
    const invite = {
      from: from.id,
      to: to.id,
      message,
      id: makeid(24),
      createdAt: new Date().getTime()
    };
    inviteMap.set(invite.id, invite);
    socket.emit('invite', invite);
    socket.on('invite-reply', reply => {
      const inviteId = reply.id;
      const answer = reply.answer;
      if (!answer) {
        inviteMap.delete(inviteId);
        return;
      }

      const fromSocket = ioService.getSocketById(fromSocketId);
      const toSocket = ioService.getSocketById(toSocketId);
      const invite = inviteMap.get(inviteId);
      const now = new Date().getTime();
      const minsElapsed = (now - invite.createdA) / (1000 * 60);
      if (minsElapsed > 3) {
        const inviteExpired = {
          invite,
          message: 'invite expires after 3 mins'
        };
        fromSocket.emit('invite-expired', inviteExpired);
        toSocket.emit('invite-expired', inviteExpired);
        inviteMap.delete(invite.id);
      }

      // start game
      const board = new Board(from.id, null, to.id, null);
      const turnIndex = Math.round(Math.random());
      let turn;
      if (turnIndex === 0) {
        turn = from.id;
      } else {
        turn = to.id;
      }
      board.turn = turn;

      boardMap.set(game.id, board);
      const nspc = ioService.getOrCreateNamespace(game.namespace);
      nspc.emit('board', {
        board,
        game
      });
      fromSocket.on('move', data => handleMove(data, game, fromSocket, from, nspc));
      toSocket.on('move', data => handleMove(data, game, toSocket, to, nspc));
    });
  }

  async updateVisibility (game, visible) {
    return super.findByIdAndUpdate(game.id, { visible });
  }
}

function handleMove (move, game, socket, user, nspc) {
  // TODO: handle the move
  console.log('move received from ', user.id);
}

function handleDisconnect (user, socket, nsp) {
  sockMap.delete(socket.id);
  nsp.emit('user-left', { id: user.id });
}

function handleChat (chat, user, socket, nsp) {
  nsp.emit('chat', { userId: user.id, chat });
}

function handleConnection (user, socket, nsp) {
  sockMap.set(socket.id, user.id);
  nsp.emit('user-joined', { id: user.id });
  socket.on('disconnect', () => handleDisconnect(user, socket, nsp));
  socket.on('chat', chat => handleChat(chat, user, socket, nsp));
}

/** @typedef {import('../models/game').GameSchema} Game */
/** @typedef {import('../models/user').UserSchema} User */

const service = new GameService();
module.exports = service;
