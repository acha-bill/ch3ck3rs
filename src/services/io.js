
class IO {
  constructor () {
    this.io = null;
  }

  /**
   *
   * @param {*} io
   */
  setIO (io) {
    this.io = io;
  }

  getOrCreateNamespace (name) {
    return this.io.of(`/${name}`);
  }

  connectedClients () {
    return this.io.clients((err, res) => {
      if (err) {
        throw err;
      }
      return res;
    });
  }

  getSocketById (socketId) {
    return this.io.sockets.connected[socketId];
  }
}

const ioService = new IO();
module.exports = ioService;
