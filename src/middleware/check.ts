import { CustomRequest } from '../controller';
import { readSync,unlinkSync, openSync, closeSync} from 'fs';
import imageType from 'image-type';
import * as express from 'express';
import { appconfig } from '../initconfig/configure';
import { ICollector, ItemFile } from '../services/upload';

// function check(req:CustomRequest,res:Response,next:NextFunction){
//     const file = appconfig.rootpathfile+req.finalFile;
//      //Patch para hacer un check de archivo cuando el filter es insuficiente
//     const buff = Buffer.alloc(12);
//     const fd = openSync(file, 'r');
//     readSync(fd,buff,0,12,0);
//     closeSync(fd);
//     const resultControl = imageType(buff);
//     if (resultControl){
//         if (resultControl.ext && resultControl.mime){
//             return next();
//         }
//     }
//     //eliminar archivo porque no cumple
//     unlinkSync(file);
//     return res.status(400).json({message:'Formato no soportado',status:false});
// }

export const checkFiles = async (req:CustomRequest,res:express.Response,next:express.NextFunction):Promise<express.Response | void > => {

    const collection:ICollector = req.listFiles as ICollector;

    let breakFail = true;

    const checkAll = collection.getAll().every((item:ItemFile)=>{
        const file = appconfig.rootpathfile + item.name;
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