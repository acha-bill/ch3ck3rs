const crypto = require('crypto');

// generate a random 24 character hex string for mongodid
module.exports.makeid = function (length) {
  const id = crypto.randomBytes(length * 2)
    .toString('hex')
    .substring(0, length);
  return id;
};
