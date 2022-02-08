import cookieParser from 'cookie-parser';
import express from 'express';
import {Request, Response, NextFunction} from 'express';

import session from 'express-session';
import { appconfig } from './config/configure';
import { errorType } from './middleware/check';
import { routerGlobal } from './routes/index';

export const app = express();

app.use(cookieParser());

app.use(
  session({
    secret: appconfig.session.secret || 'eb4378274c564f2d56b2316f976cb86bf76643159b21',
    resave: false,
    saveUninitialized: false
  }),
);


app.disable('x-powered-by');

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

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
  return res.status(403).json({message:'Request denied'});
});

