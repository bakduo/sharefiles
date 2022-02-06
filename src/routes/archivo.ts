import express from 'express';

import {Request, Response} from 'express';

import { check, checkFiles } from '../middleware/check';

import { ArchivoController } from '../controller/archivo';

import { upload } from '../services/upload';

import { protectionMiddleware, checkToken } from '../middleware/csrf';

const controller = new ArchivoController();

export const routerArchivo = express.Router();

routerArchivo.get('/',protectionMiddleware,(req:Request,res:Response)=>{

  return res.render('main',{ csrfToken: req.csrfToken()});

});
  
routerArchivo.post('/uploadfile',[upload.single('archivouser'),check],controller.saveOne);

routerArchivo.post('/uploadfiles', [upload.array('archivosuser', 4)],controller.saveMulti);

routerArchivo.post('/uploadfilescheck',[protectionMiddleware,upload.array('archivosuser', 4),checkFiles],controller.saveMultiControl);

  
  