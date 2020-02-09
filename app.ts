import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import { usersRouter, groupsRouter } from './routes/index';
import { db } from './models/index';

export const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/users', usersRouter);
app.use('/groups', groupsRouter);

Object.keys(db.models).forEach((modelName) => {
    if (db.models[modelName].associate) {
        db.models[modelName].associate(db.models);
    }
});
