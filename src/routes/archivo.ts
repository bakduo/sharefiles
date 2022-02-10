import express from 'express';

import {Request, Response} from 'express';

import { checkFiles } from '../middleware/check';

import { ArchivoController } from '../controller/archivo';

import { upload } from '../services/upload';

import { protectionMiddleware } from '../middleware/csrf';

import { MLinkUser } from '../dao/mongo/link-user';
import { encriptFiles } from '../middleware/encrypt';

const daoLink = new MLinkUser();

const controller = new ArchivoController(daoLink);

export const routerArchivo = express.Router();

routerArchivo.get('/',protectionMiddleware,(req:Request,res:Response)=>{

  return res.render('main',{ csrfToken: req.csrfToken()});

});
  
//routerArchivo.post('/uploadfile',[upload.single('archivouser'),check],controller.saveOne);

//routerArchivo.post('/uploadfiles', [upload.array('archivosuser', 4)],controller.saveMulti);

routerArchivo.post('/uploadfilescheck',[protectionMiddleware,upload.array('archivosuser', 4),checkFiles,encriptFiles],controller.saveMultiControl);

routerArchivo.get('/:id',[protectionMiddleware],controller.getFile);

  
  