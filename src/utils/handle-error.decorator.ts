import isEmpty from 'lodash/isEmpty';

import { jsonLogger, simpleLogger } from './loggers';

export function handleError(object, propertyKey: string, descriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function(...args) {
        const [req, res, next] = args;
        try {
            await originalMethod.apply(this, args);
        } catch (e) {
            if (!!e.status && e.status < 500) {
                simpleLogger.warn(`STATUS_CODE: ${e.status} - ${e.message}`);
            } else {
                e.status = 500;
                simpleLogger.error(`STATUS_CODE: ${e.status} - ${e.message}`);
            }
            simpleLogger.info(propertyKey);
            if (!isEmpty(req.query)) {
                simpleLogger.info('QUERY=');
                jsonLogger.info(req.query);
            }
            if (!isEmpty(req.params)) {
                simpleLogger.info('PARAMS=');
                jsonLogger.info(req.params);
            }
            if (!isEmpty(req.body)) {
                simpleLogger.info('BODY=');
                jsonLogger.info(req.body);
            }

            next(e);
        }
    };
}
