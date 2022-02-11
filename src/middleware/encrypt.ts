import { CustomRequest } from '../controller';
import * as express from 'express';
import { appconfig, encryptFile, loggerApp } from "../initconfig/configure";
import { EncodeFileStreamCipher } from '../services/cipher';
import { ICollector, ItemFile } from "../services/upload";
import * as fs from 'fs';
import * as stream from 'stream';
import * as util from 'util';


const finished = util.promisify(stream.finished);

export const encriptFiles = async (req:CustomRequest,res:express.Response,next:express.NextFunction):Promise<express.Response | void> => {

    const collection:ICollector = req.listFiles as ICollector;

    const archivos = collection.getAll();

    archivos.forEach((item:ItemFile)=>{

        const file = appconfig.rootpathfile + item.name;

        const encfile = file + ".enc";
        
        const readableStreamEvent = fs.createReadStream(file);

        const writableStreamEventEnc = new EncodeFileStreamCipher(encfile,encryptFile,true);

        finished(stream.pipeline(

            readableStreamEvent,

            writableStreamEventEnc,

        (err) => {
            if (err) {
            loggerApp.error('Pipeline into middleware failed', err);
            } else {
            loggerApp.debug('Pipeline into middleware succeeded');
            }
        }
        ));

    })

    Promise.all(archivos)
    .then(()=>{
        return next();
    })
    .catch((error)=>{
        return res.status(400).json({message:error.message,status:false});
    });

    return res.status(400).json({message:'sample',status:false});
    
}