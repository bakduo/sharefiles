import cookieParser from 'cookie-parser';
import express from 'express';
import session from 'express-session';
import { routerGlobal } from './routes/index';

export const app = express();

app.use(cookieParser());

app.use(
  session({
    secret: process.env.SECRET || 'eb4378274c564f2d56b2316f976cb86bf76643159b21',
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
// error handler
