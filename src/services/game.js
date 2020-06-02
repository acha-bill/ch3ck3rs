const { makeid } = require('../utils/methods');
const GameModel = require('../models/game');
const GenericCrudService = require('./generic-crud-service');
const ioService = require('./io');
const Board = require('./board');
const userService = require('./users');
const Events = require('../enums/events');

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
      nsp.on(Events.on.CONNECTION, handleConnection);
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
    socket.emit(Events.emit.INVITE, invite);
    socket.on(Events.on.INVITE_REPLY, reply => handleInviteReply(reply, game, from, fromSocketId, to, toSocketId, message));
  }

  async updateVisibility (game, visible) {
    return super.findByIdAndUpdate(game.id, { visible });
  }
}

/**
 * Handles the reploy of an invite
 * @param {reploy} reply
 * @param {Gae} game
 * @param {User} from
 * @param {Number} fromSocketId
 * @param {User} to
 * @param {Number} toSocketId
 * @param {String} message
 */
async function handleInviteReply (reply, game, from, fromSocketId, to, toSocketId, message) {
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
    fromSocket.emit(Events.emit.INVITE_EXPIRED, inviteExpired);
    toSocket.emit(Events.emit.INVITE_EXPIRED, inviteExpired);
    inviteMap.delete(invite.id);
  }

  // start game
  const board = new Board(from.id, 'red', to.id, 'yellow');
  board.turn = Math.round(Math.random());

  boardMap.set(game.id, board);
  const nspc = ioService.getOrCreateNamespace(game.namespace);
  nspc.emit(Events.emit.BOARD, {
    board,
    game
  });
  userService.addGame(from.id, game.id);
  userService.addGame(to.id, game.id);
  fromSocket.on(Events.on.MOVE, data => handleMove(data, game, fromSocket, from, nspc));
  toSocket.on(Events.on.MOVE, data => handleMove(data, game, toSocket, to, nspc));
}

/**
 * Handles a move from the game players.
 *
 * It starts by checking if the game is still active, of available at all.
 * Then, checks if the move is valid.
 * If the move is valid, it makes it, switches player turns and then broadcasts the move on the namespace.
 * @param {move} move
 * @param {Game} game
 * @param {socket} socket
 * @param {User} user
 * @param {namespace} nspc
 */
async function handleMove (move, game, socket, user, nspc) {
  console.log('move ', move, ' received from ', user.id);
  if (!game.active) {
    console.log('game is ended');
    return;
  }
  const board = boardMap.get(game.id);
  const result = board.move(move);
  nspc.emit(Events.emit.MOVE_RESULT, {
    from: user.id,
    move: result,
    nextTurn: board.turn
  });
  if (!result) {
    return;
  }
  if (board.winner > -1) {
    game = await GameModel.findByIdAndUpdate(game.id, {
      winner: board.players[board.winner],
      active: false
    }, { new: true });
  }
}

/**
 * Handles disconnection from the namespace
 * @param {User} user
 * @param {socket} socket
 * @param {namespace} nsp
 */
function handleDisconnect (user, socket, nsp) {
  sockMap.delete(socket.id);
  nsp.emit(Events.emit.USER_LEFT, { id: user.id });
}

/**
 * Handle chat.
 * When a chat is received, it's broadcasted to all connected users on the namespace
 * @param {chat} chat The chat obj
 * @param {User} user
 * @param {socket} socket
 * @param {namspace} nsp
 */
function handleChat (chat, user, socket, nsp) {
  nsp.emit(Events.emit.CHAT, { userId: user.id, chat });
}

/**
 * Handles a connection from a user.
 * @param {User} user connected user
 * @param {socket} socket user socket
 * @param {Namespace} nsp namespace
 */
function handleConnection (user, socket, nsp) {
  sockMap.set(socket.id, user.id);
  nsp.emit(Events.emit.USER_JOINED, { id: user.id });
  socket.on(Events.on.DISCONNECT, () => handleDisconnect(user, socket, nsp));
  socket.on(Events.on.CHAT, chat => handleChat(chat, user, socket, nsp));
}

/** @typedef {import('../models/game').GameSchema} Game */
/** @typedef {import('../models/user').UserSchema} User */

const service = new GameService();
module.exports = service;
