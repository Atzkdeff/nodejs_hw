import winston from 'winston';

export const stdLogger: winston.Logger = winston.createLogger({
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(winston.format.colorize(), winston.format.simple())
        })
    ]
});

export const simpleLogger: winston.Logger = winston.createLogger({
    level: 'info',
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp(),
                winston.format.simple()
            )
        })
    ]
});

export const jsonLogger: winston.Logger = winston.createLogger({
    level: 'info',
    transports: [
        new winston.transports.Console({
            format: winston.format.json()
        })
    ]
});
