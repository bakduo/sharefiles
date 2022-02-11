import { CustomRequest, MyType } from '../controller';
import * as express from 'express';
import { appconfig, encryptFile, loggerApp, tokenEnc } from "../initconfig/configure";
import { EncodeFileStreamCipher, IHashCiper } from '../services/cipher';
import { ICollector, ItemFile } from "../services/upload";
import * as fs from 'fs';
import * as stream from 'stream';
import * as util from 'util';
import { MLinkUser } from '../dao';
import { v4 as uuid } from 'uuid';
  
const finished = util.promisify(stream.finished);

export const encriptFiles = async (req:CustomRequest,res:express.Response,next:express.NextFunction):Promise<express.Response | void> => {

    const collection:ICollector = req.listFiles as ICollector;

    const archivos = collection.getAll();

    const daoLink = new MLinkUser();

    const promiseFiles = archivos.map(async (item:ItemFile)=>{

        const file = appconfig.rootpathfile + item.name;

        const encfile = file + ".enc";
        
        const readableStreamEvent = fs.createReadStream(file);

        const writableStreamEventEnc = new EncodeFileStreamCipher(encfile,encryptFile,true);

        return await finished(stream.pipeline(

            readableStreamEvent,

            writableStreamEventEnc,

            (err) => {
                if (err) {
    
                    loggerApp.error('Pipeline into middleware failed', err);
    
                    throw new Error(`Exception on Pipeline into middleware failed: ${err.message}`);
    
                } else {
    
                    loggerApp.debug('Pipeline into middleware succeeded, delete orig file');
                    //elimina origninal
                    fs.unlinkSync(file);
                }
            }
        ));
        
    });

    try {

        const saveRecords = archivos.map(async (item:ItemFile)=>{

            const idFile = uuid();
            //Hasta 4 dias
            const finalDate = new Date((Date.now() + 400000000)).getTime();
    
            let hash:IHashCiper;
    
            try {
                hash = tokenEnc.encrypt(finalDate.toString());
            } catch (error:unknown) {
                const err = error as MyType;
    
                loggerApp.error(`Exception on encrypt.encrypt: ${err.message}`);
    
                throw new Error(`Exception on IHashCiper into file`);
            }
    
            const url = `${appconfig.protocol}://${appconfig.hostname}/${idFile}?token=${hash.iv}&content=${hash.content}`;
    
            try {
    
                const saveItem = await daoLink.saveOne({
                    url:`${url}`,
                    uuid: idFile,
                    deadline:finalDate,
                    deleted:false,
                    ephemeral:false,
                    origname:item.name,
                    pathfile:appconfig.rootpathfile+item.name+".enc"
                });
    
    
                return saveItem;
                    
            } catch (error:unknown) {
                
                const err = error as MyType;
    
                fs.unlinkSync(appconfig.rootpathfile+item.name+".enc");
    
                loggerApp.error(`Exception on this.dmodel.saveOne into MongoDB ${err.message}`);
    
                throw new Error(`Exception on this.dmodel.saveOne into MongoDB`);
            }
        });

        //All file encrypted
        await Promise.all(promiseFiles);
        
        const allItems = await Promise.all(saveRecords);

        req.linksLoad = allItems.map((item)=>{
            return {link:item.url,name:item.origname}
        })
            
        return next();

    } catch (error:unknown) {

        const err = error as MyType;

        return res.status(400).json({message:err.message,status:false});
    }
       
}