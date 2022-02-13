//import {Request, Response, NextFunction} from 'express';
import * as express from 'express';

import * as stream from 'stream';
import * as util from 'util';
const finished = util.promisify(stream.finished);
import { unlinkSync } from 'fs';
import * as fs from 'fs';
import { IGenericDB } from '../datasources';
import { LinkUser, MLinkUser } from '../dao';
import { LinkUserDTO } from '../dto/link-user';
import { tokenEnc, appconfig, encryptFile, loggerApp } from '../initconfig';
import { EncodeFileStreamCipher, ICollector } from '../services';

export interface IBodyResponseLink {
  name?:string;
  link?:string;
}

export interface ErrorMiddleware extends TypeError {
  code?:string;
}

export type errorType = ErrorMiddleware;

export interface CustomRequest extends express.Request {
  finalFile?: string,
  listFiles?: ICollector,
  linksLoad?: IBodyResponseLink[]
}

export interface MyType extends Error {
  httpStatusCode?: number,
}

export const CODE_UPLOAD_MULTER=1;

export const CODE_UPLOAD_DEFAULT=2;

//const bufferEnc = crypto.randomBytes(24);

export class ArchivoController {

    dmodel : IGenericDB<LinkUser | LinkUserDTO >;

    constructor(){

      this.dmodel = new MLinkUser();

      //https://stackoverflow.com/questions/31362292/how-to-use-arrow-functions-public-class-fields-as-class-methods
      //It's not Good for me. I prefeer arrow function
      //this.saveMultiControl = this.saveMultiControl.bind(this);
    }

    getFile = async (req:express.Request, res:express.Response,next:express.NextFunction):Promise<express.Response | void> => {
      
      const {id} = req.params;

      const {token,content } = req.query;

      if (id && token && content){

        const tokenDecrypt = tokenEnc.decrypt({
          'iv':token.toString(),
          'content':content.toString()
        });

        const fileObj = await this.dmodel.findOne({keycustom:'uuid',valuecustom:id});

        if (fileObj){

          const {deadline} = fileObj;

          if (deadline){
            if (deadline===Number(tokenDecrypt)){

              //DEC:
              const readableStreamEventDec = fs.createReadStream(fileObj.pathfile);

              const writableStreamEventDnc = new EncodeFileStreamCipher(appconfig.rootpathfile + fileObj.origname,encryptFile,false);

              //Pipiline is safe.. while use pipe() not secure

              await finished(stream.pipeline(

                readableStreamEventDec,

                writableStreamEventDnc,

                (err) => {
                  if (err) {
                    loggerApp.error('Pipeline failed', err);
                  } else {
                    loggerApp.debug('Pipeline succeeded');
                  }
                }
              ));

              loggerApp.debug('got all the data DEC');

              loggerApp.debug(`${appconfig.rootpathfile} + ${fileObj.origname}`);

              return res.status(200).sendFile(`${appconfig.rootpathfile}${fileObj.origname}`, {
                root: '.'
              }, function (err) {
                  if (err) {
                      loggerApp.error(`Exception Sent: ${fileObj.origname}: ${err.message}`);
                      next(err);
                  } else {
                      loggerApp.info(`Sent: ${fileObj.origname}`);
                      unlinkSync(appconfig.rootpathfile + fileObj.origname);
                  }
              });
            }
          } 
        }
      }
      return res.status(403).json({status:false,message:'Exception invalid request'});
    }

    //I prefeer arrow function.
    saveMultiControl = async (req:CustomRequest, res:express.Response):Promise<express.Response> => {

        const files = req.files;

        const linksFiles = req.linksLoad;
        
        if (!files) {
      
          return res.status(500).json({status:false,message:'Error procesar archivo'});
        }
     
        try {

          if (linksFiles){
            return res.status(200).json({files:linksFiles,status:true,message:'OK files'});
          }

          return res.status(404).json({files:linksFiles,status:false,message:`Not files exists`});
          
        } catch (error:unknown) {

           const err = error as MyType;

          loggerApp.error(`Exception on response files finished ${err.message}`);

          throw new Error(`Exception on response files finished ${err.message}`);
        }
  
    }

    saveOne(req:express.Request, res:express.Response):express.Response{
        try{

            const file = req.file as Express.Multer.File;

            if (!file) {
                return res.status(500).json({status:false,message:'Error procesar archivo'});
            }
        
            return res.send(`Archivo <b>${file.originalname}</b> subido exitosamente`)

      } catch (error:unknown) {
        const err = error as MyType
        err.httpStatusCode = 500;
        loggerApp.error(`Exception on saveOne: ${err.message}`);
        throw new Error(`Exception en la funcionalidad filename: ${err.message}`);
      }
    }

    saveMulti(req:express.Request, res:express.Response):express.Response{

        const files = req.files;
    
          if (!files) {
        
            return res.status(500).json({status:false,message:'Error procesar archivo'});
          }
        const archivosTransform = files as Array<Express.Multer.File>;
    
        const archivos = archivosTransform.map((item)=>item.originalname);
 
        return res.status(200).json({files:archivos,status:true});
    }

}