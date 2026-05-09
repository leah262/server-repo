const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '../server.log');

class Logger {
  static log(level, message, metadata = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...metadata
    };
    
    const logString = `[${timestamp}] ${level.toUpperCase()}: ${message} ${JSON.stringify(metadata)}\n`;
    
    fs.appendFileSync(logFile, logString);
  }

  static info(message, metadata) {
    this.log('info', message, metadata);
  }

  static warn(message, metadata) {
    this.log('warn', message, metadata);
  }

  static error(message, metadata) {
    this.log('error', message, metadata);
  }

  static security(message, metadata) {
    this.log('security', message, metadata);
  }
}

module.exports = Logger;
