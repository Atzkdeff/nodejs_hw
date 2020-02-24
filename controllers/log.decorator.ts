import winston from 'winston';

const loggerSimple: winston.Logger = winston.createLogger({
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

const loggerJson: winston.Logger = winston.createLogger({
    level: 'info',
    transports: [
        new winston.transports.Console({
            format: winston.format.json()
        })
    ]
});

export function log(object, propertyKey: string, descriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function(...args) {
        loggerSimple.info(propertyKey);
        loggerJson.info(args);
        try {
            await originalMethod.apply(this, args);
        } catch (e) {
            loggerSimple.info(e.message);

            // next(e)
            args[2](e);
        }
    };
}
