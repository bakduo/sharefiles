import { MongoConnect } from './../datasources/storage/mongo';
import config from 'config';
import pino from "pino";
import stream from 'stream';
import { IConfigDB } from '../datasources/storage/config';

import childProcess from 'child_process';

export const appconfig:IConfigDB = config.get('app');

const logThrough = new stream.PassThrough();

// Environment variables
const cwd = process.cwd();
const { env } = process;
const logPath = cwd + '/log';

const child = childProcess.spawn(
    process.execPath,
    [
      require.resolve('pino-tee'),
      'warn',
      `${logPath}/log.warn.log`,
      'error',
      `${logPath}/log.error.log`,
      'info',
      `${logPath}/log.info.log`,
      'debug',
      `${logPath}/log.debug.log`,
    ],
    { cwd, env }
  );
  
logThrough.pipe(child.stdin);

export const loggerApp = pino(
{
    name: 'app-sharefiles',
    level: 'debug'
},
logThrough
);

export const connectionDB = MongoConnect.getInstance(
  appconfig.db.mongo.url,
  appconfig.db.mongo.user,
  appconfig.db.mongo.pass,
  appconfig.db.mongo.dbname).getConnection();

