import {Request} from 'express';

import { v4 as uuid } from 'uuid';

import multer, { FileFilterCallback } from 'multer';

import { mkdirSync} from 'fs';

import { appconfig, loggerApp} from '../initconfig/configure';

import { CustomRequest, MyType } from '../controller';

const MimeAvailable:string[] = ['image/png','image/jpg','image/jpeg','text/plain','application/pdf','text/x-shellscript','application/zip'];

export interface ICollector {
  addItem(orig:string,item:string):void;
  getAll():ItemFile[];
  clear():void;
}

export interface ItemFile {
  id:string;
  orig: string;
  name:string;
}

export class CollectorFiles implements ICollector{
  
  private files:ItemFile[];

  constructor(){
    this.files = [];
  }

  addItem(orig:string,item:string){
    this.files.push({orig:orig,name:item,id:uuid()});
  }

  getAll():ItemFile[]{
    return this.files;
  }

  clear(){
    this.files = [];
  }
}

const tmpFiles = new CollectorFiles();

//https://stackoverflow.com/questions/59097119/using-multer-diskstorage-with-typescript

type DestinationCallback = (error: Error | null, destination: string) => void

type FileNameCallback = (error: Error | null, filename: string) => void

const storage = multer.diskStorage({

    destination: function (req:Request, file:Express.Multer.File, callback:DestinationCallback) {
       try {
          mkdirSync(appconfig.rootpathfile);
        } catch (error:unknown) {
            const err = error as MyType;
            loggerApp.error(`Exception destination diskStorage: ${err.message}`);
       }
       callback(null, appconfig.rootpathfile);
    },
  
    filename: function (req:CustomRequest, file:Express.Multer.File, callback:FileNameCallback) {
      const nombre = `${Date.now()}-${file.originalname}`;
        try {
        tmpFiles.addItem(file.originalname,nombre);
        req.listFiles = tmpFiles;
        callback(null, nombre);
      } catch (error) {
        const err = error as MyType;
        loggerApp.error(`Exception filename diskStorage: ${err.message}`);
        callback(new Error(`Error en la funcionalidad filename: ${err.message}`),nombre);
      }
    }
  });
  
  //maximo 10MB
  export const upload = multer(
  {
  limits: { fileSize: 10 * 1024 * 1024 },
  storage: storage,
  fileFilter : (req:Request, file:Express.Multer.File, cb:FileFilterCallback) => {
      loggerApp.debug(`Agregando file ${file.mimetype}`);
      if (MimeAvailable.includes(file.mimetype)){
      //if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error('Solo esta permitido los siguientes formatos: .png, jpg, jpeg, pdf y zip'));
      }
    }
  });