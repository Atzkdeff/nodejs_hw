import { stdLogger } from './loggers';

export function caughtException(err: Error) {
    stdLogger.error(err.message);
    process.exit(1);
}

export function handleRejection(err: Error) {
    stdLogger.error(err.message);
}

export function handleServerError(err, req, res, next) {
    res.status(err.status).send(err.status !== 500 ? err.message : 'Internal Server Error');
}
