import { CustomRequest } from '../controller';
import { readSync,unlinkSync, openSync, closeSync} from 'fs';
import imageType from 'image-type';
import {Response, NextFunction} from 'express';
import { appconfig } from '../initconfig/configure';
import { ICollector, ItemFile } from '../services/upload';
import mime from 'serve-static/node_modules/@types/mime';


//TODO unify
const MimeAvailableImage:string[] = ['image/png','image/jpg','image/jpeg'];

const MimeAvailableOther:string[] = ['text/plain','application/pdf','text/x-shellscript','application/zip','application/javascript'];

export const checkFiles = async (req:CustomRequest,res:Response,next:NextFunction):Promise<Response | void > => {

    if (req.listFiles){

        const collection:ICollector = req.listFiles as ICollector;

        let breakFail = true;
    
        const checkAll = collection.getAll().every(async(item:ItemFile)=>{
    
            const file = appconfig.rootpathfile + item.name;
    
            if (MimeAvailableImage.includes(mime.lookup(file))){
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

            }else{

                if (MimeAvailableOther.includes(mime.lookup(file))){
                    return true;
                }
                return false;
            }
        })

        if (checkAll){
            return next();
        }
    }

       
    //Patch para hacer un check de archivo cuando el filter es insuficiente   
    //eliminar archivo porque no cumple
    
    return res.status(400).json({message:'Formato no soportado',status:false});

}