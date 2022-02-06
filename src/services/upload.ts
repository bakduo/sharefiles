import {Request} from 'express';

import multer, { FileFilterCallback } from 'multer';

import { mkdirSync} from 'fs';

import { CustomRequest, MyType } from '../controller/archivo';

const MimeAvailable:string[] = ['image/png','image/jpg','image/jpeg','text/plain','application/pdf','text/x-shellscript','application/zip'];

export interface ICollector {
  addItem(item:string):void;
  getAll():string[];
  clear():void;
}

class CollectorFiles implements ICollector{
  
  private files:string[];

  constructor(){
    this.files = [];
  }

  addItem(item:string){
    this.files.push(item);
  }

  getAll(){
    return this.files;
  }

  clear(){
    this.files = [];
  }
}

export const tmpFiles = new CollectorFiles();

//https://stackoverflow.com/questions/59097119/using-multer-diskstorage-with-typescript

type DestinationCallback = (error: Error | null, destination: string) => void

type FileNameCallback = (error: Error | null, filename: string) => void

const storage = multer.diskStorage({

    destination: function (req:Request, file:Express.Multer.File, callback:DestinationCallback) {
       try {
          mkdirSync('uploads');
        } catch (error:unknown) {
            const err = error as MyType
            console.error(err.message);
       }
       callback(null, 'uploads');
    },
  
    filename: function (req:CustomRequest, file:Express.Multer.File, callback:FileNameCallback) {
      const nombre = `${Date.now()}-${file.originalname}`;
        try {
        tmpFiles.addItem(nombre);
        req.listFiles = tmpFiles;
        callback(null, nombre);
      } catch (error) {
        const err = error as MyType
        console.error(err.message);
        callback(new Error(`Error en la funcionalidad filename: ${err.message}`),nombre);
      }
    }
  });
  
  //maximo 2MB
  export const upload = multer(
  {
  limits: { fileSize: 4 * 1024 * 1024 },
  storage: storage,
  fileFilter : (req:Request, file:Express.Multer.File, cb:FileFilterCallback) => {
      console.log(file);
      if (MimeAvailable.includes(file.mimetype)){
      //if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error('Solo esta permitido los siguientes formatos: .png, jpg y jpeg'));
      }
    }
  });