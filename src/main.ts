import cookieParser from 'cookie-parser';
import express from 'express';
import {Request, Response, NextFunction} from 'express';
import session from 'express-session';
import { routerGlobal } from './routes/index';
import ConnectMemcached = require('connect-memcached');
import { appconfig } from './initconfig/configure';
import { errorType } from './controller';

const MemcachedStore = ConnectMemcached(session);

export const app = express();

app.use(cookieParser());

app.use(
  session({
    secret: appconfig.session.secret || 'changeme',
    resave: false,
    saveUninitialized: false,
    store: new MemcachedStore({
      ttl: 1,
      hosts: [`${appconfig.memcached.server}:${appconfig.memcached.port}`],
      secret: appconfig.memcached.secret, // Optionally use transparent encryption for memcache session data,
      prefix: "sharedlink_"
    })
  }),
);


app.disable('x-powered-by');

app.use(express.json({limit: '10mb'}));

app.use(express.urlencoded({ limit: '10mb',extended: true }));

app.use(express.static('public'));

app.set('views','./src/views');

app.set('view engine','ejs');

app.use(routerGlobal);

//Handler GET 404 for not found
app.use((req:Request, res:Response)=> {
  return res.status(404).json({message:'Request not found'});
});

//Error Handler
app.use((err:errorType, req:Request, res:Response, next:NextFunction)=> {

  if (err.code){
      if (err.code !== 'EBADCSRFTOKEN') return next(err)
  }

  // handle CSRF token errors here
  return res.status(403).json({message:`Request denied: ${err.message}`});
});

