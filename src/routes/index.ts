
import express from 'express';

import { routerArchivo } from './archivo';

export const routerGlobal = express.Router();


routerGlobal.use('/',routerArchivo);



