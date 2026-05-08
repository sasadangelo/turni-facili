const { createLogger, format, transports } = require("winston");

// Read the log level from the LOGLEVEL environment variable, the default value is "info"
const logLevel = process.env.LOGLEVEL || "info";

const logger = createLogger({
  level: logLevel, // Log levels available: error, warn, info, http, verbose, debug, silly
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(({ timestamp, level, message, meta }) => {
      return `${timestamp} [${level.toUpperCase()}] ${message} ${meta ? JSON.stringify(meta) : ""}`;
    })
  ),
  transports: [
    new transports.Console(), // Stampa in console
    new transports.File({ filename: "logs/app.log", level: "info" }) // Salva su file
  ]
});

module.exports = logger;