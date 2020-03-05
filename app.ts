import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import { usersRouter, groupsRouter } from './routes/index';
import { db } from './models/index';
import { caughtException, handleRejection, handleServerError } from './loggers/index';

export const app = express();

process.on('uncaughtException', caughtException).on('unhandledRejection', handleRejection);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/users', usersRouter);
app.use('/groups', groupsRouter);
app.use(handleServerError);

db.sync().then(() => console.log('All models were synchronized successfully.'));

Object.keys(db.models).forEach((modelName) => {
    if (db.models[modelName].associate) {
        db.models[modelName].associate();
    }
});
