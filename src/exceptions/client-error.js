class ClientError {
  constructor (message, code = null, data = null) {
    this.message = message;
    this.code = code;
    this.data = data;
  }
}
module.exports = ClientError;
