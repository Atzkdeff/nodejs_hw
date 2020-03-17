import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import { usersRouter, groupsRouter, authRouter } from './routes/index';
import { db } from './models/index';
import { checkToken, caughtException, handleRejection, handleServerError } from './middlewares/index';
import cors, { CorsOptions } from 'cors';

export const app = express();

let corsOptions: CorsOptions = {
    origin: 'http://epam.com',
    methods: ['GET', 'PATCH', 'POST', 'DELETE'],
    optionsSuccessStatus: 200
};

process.on('uncaughtException', caughtException).on('unhandledRejection', handleRejection);

app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/login', authRouter);

app.use('/users', checkToken, usersRouter);
app.use('/groups', checkToken, groupsRouter);
app.use(handleServerError);

db.sync().then(() => console.log('All models were synchronized successfully.'));

Object.keys(db.models).forEach((modelName) => {
    if (db.models[modelName].associate) {
        db.models[modelName].associate();
    }
});
