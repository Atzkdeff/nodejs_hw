import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import winston from 'winston';

import { usersRouter, groupsRouter } from './routes/index';
import { db } from './models/index';

export const app = express();

const logger: winston.Logger = winston.createLogger({
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(winston.format.colorize(), winston.format.simple())
        })
    ]
});

process
    .on('uncaughtException', (err: Error) => {
        logger.error(err.message);
        process.exit(1);
    })
    .on('unhandledRejection', (err: Error) => {
        logger.error(err.message);
    });

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/users', usersRouter);
app.use('/groups', groupsRouter);
app.use((err, req, res, next) => {
    logger.warn(err.message);
    res.status(err.status ? err.status : 500).send(err.status ? err.message : 'Internal Server Error');
});

db.sync().then(() => console.log('All models were synchronized successfully.'));

Object.keys(db.models).forEach((modelName) => {
    if (db.models[modelName].associate) {
        db.models[modelName].associate();
    }
});
