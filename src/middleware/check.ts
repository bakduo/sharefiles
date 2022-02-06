import {Response, NextFunction} from 'express';
import { readSync,unlinkSync, openSync, closeSync} from 'fs';
import imageType from 'image-type';
import { CustomRequest } from '../controller/archivo';
import { ICollector } from '../services/upload';

interface ErrorMiddleware extends Error {
    code?:string;
}

type errorType = ErrorMiddleware;

export function errorHandler(err:errorType, req:Request, res:Response, next:NextFunction){
    
    if (err.code !== 'EBADCSRFTOKEN') return next(err)
  
    // handle CSRF token errors here
    res.status(403)
    res.send('form tampered with')
}

export function check(req:CustomRequest,res:Response,next:NextFunction){

    const file = 'uploads/'+req.finalFile;
     //Patch para hacer un check de archivo cuando el filter es insuficiente
    const buff = Buffer.alloc(12);
    const fd = openSync(file, 'r');
    readSync(fd,buff,0,12,0);
    closeSync(fd);
    const resultControl = imageType(buff);
    if (resultControl){
        if (resultControl.ext && resultControl.mime){
            return next();
        }
    }
    //eliminar archivo porque no cumple
    unlinkSync(file);
    return res.status(400).json({message:'Formato no soportado',status:false});
}


export function checkFiles(req:CustomRequest,res:Response,next:NextFunction){

    const collection:ICollector = req.listFiles as ICollector;

    const archivos = collection.getAll();

    let breakFail = true;

    const checkAll = archivos.every((item)=>{
        const file = 'uploads/'+item;
        const buff = Buffer.alloc(12);
        const fd = openSync(file, 'r');
        readSync(fd,buff,0,12,0);
        closeSync(fd);
        const resultControl = imageType(buff);
        if (resultControl){
            breakFail = (!resultControl.ext || !resultControl.mime);
            if (!breakFail){
                return true
            }else{
                unlinkSync(file);
                return false;
            }
        }else{
            unlinkSync(file);
            return false
        }
    })
    if (checkAll){
        return next();
    }
    
    //Patch para hacer un check de archivo cuando el filter es insuficiente   
    //eliminar archivo porque no cumple
    
    return res.status(400).json({message:'Formato no soportado',status:false});
}