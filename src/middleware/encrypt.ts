
import {Response, NextFunction} from 'express';
import { CustomRequest } from "../controller/archivo";
import { appconfig } from "../initconfig/configure";
import { CipherFile } from "../services/cipher";
import { ICollector, ItemFile } from "../services/upload";
import * as fs from 'fs';

export function encriptFiles(req:CustomRequest,res:Response,next:NextFunction){

    const collection:ICollector = req.listFiles as ICollector;

    const archivos = collection.getAll();

    const encrypt = new CipherFile({
        algorithm:appconfig.encrypt.algorithm,
        secretKey:appconfig.encrypt.secretKey
      });

    archivos.forEach((item:ItemFile)=>{

        const file = appconfig.rootpathfile + item.name;

        const encfile = file + ".enc";
        
        const readableStreamEvent = fs.createReadStream(file);

        const writableStreamEventEnc = fs.createWriteStream(encfile);

        readableStreamEvent.on('data', function (chunkBuffer:Buffer) {
            const buffer = encrypt.encrypt(Buffer.from(chunkBuffer).toString());
            writableStreamEventEnc.write(buffer);
        });

        readableStreamEvent.on('end', function(){
            writableStreamEventEnc.end();
        });

    })

    Promise.all(archivos)
    .then(()=>{
        next();
    })
    .catch((error)=>{
        return res.status(400).json({message:error.message,status:false});
    });
    
}