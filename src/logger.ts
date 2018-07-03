import winston from "winston";

const logFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.align(),
  winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
);

export const log = winston.createLogger({
  format: logFormat,
  level: "debug",
  transports: [
    // //
    // // - Write to all logs with level `info` and below to `combined.log`
    // // - Write all logs error (and below) to `error.log`.
    // //
    // new winston.transports.File({ filename: 'error.log', level: 'error' }),
    // new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console(),
  ],
});
