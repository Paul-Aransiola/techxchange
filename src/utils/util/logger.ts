// eventually, we will integrate this to sentry or an error boundary service

import { createLogger, format, transports } from 'winston';

const log = createLogger({
  level: 'info',
  format: format.combine(format.timestamp(), format.prettyPrint()),
  transports: [
    new transports.Console(), // Temporarily log to console
    new transports.File({ filename: 'logs/test-log.log', options: { flags: 'a' } }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  log.add(
    new transports.Console({
      format: format.simple(),
    })
  );
}
log.debug('debugging');

export default {
  error: (...val: unknown[]) => log.error(val),
  info: (...val: unknown[]) => log.info(val),
  warn: (...val: unknown[]) => log.warn(val),
  debug: (...val: unknown[]) => log.debug(val),
};
