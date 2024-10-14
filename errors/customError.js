class ClientError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.name = "ClientError";
      this.statusCode = statusCode || 400;
    }
  }
  
  class CriticalError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.name = "CriticalError";
      this.statusCode = statusCode || 500;
    }
  }
  
  module.exports = { ClientError, CriticalError };
  