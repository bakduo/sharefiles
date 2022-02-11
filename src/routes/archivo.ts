import * as express from 'express';

import { upload } from '../services/upload';

import { MLinkUser } from '../dao/mongo/link-user';

import { ArchivoController } from '../controller/archivo';

import { checkFiles, encriptFiles, protectionMiddleware } from '../middleware';

const daoLink = new MLinkUser();

const controller = new ArchivoController(daoLink);

export const routerArchivo = express.Router();

routerArchivo.get('/',protectionMiddleware,(req:express.Request,res:express.Response)=>{

  return res.render('main',{ csrfToken: req.csrfToken()});

});
  
//routerArchivo.post('/uploadfile',[upload.single('archivouser'),check],controller.saveOne);

//routerArchivo.post('/uploadfiles', [upload.array('archivosuser', 4)],controller.saveMulti);

routerArchivo.post('/uploadfilescheck',[
  protectionMiddleware,
  upload.array('archivosuser', 4),
  checkFiles,
  encriptFiles
],
  controller.saveMultiControl);

routerArchivo.get('/:id',[protectionMiddleware],controller.getFile);

  
  