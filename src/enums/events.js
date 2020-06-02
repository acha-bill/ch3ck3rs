module.exports.emit = Object.freeze({
  INVITE: 'invite',
  INVITE_EXPIRED: 'invite_expired',
  BOARD: 'board',
  MOVE_RESULT: 'move_result',
  USER_LEFT: 'user_left',
  CHAT: 'chat',
  USER_JOINED: 'user_joined'
});

module.exports.on = Object.freeze({
  CONNECTION: 'connection',
  INVITE_REPLY: 'invite_reply',
  MOVE: 'move',
  DISCONNECT: 'disconnect',
  CHAT: 'chat'
});
