import {Request, Response, NextFunction} from 'express';

import { ICollector } from '../services/upload';

export interface CustomRequest extends Request {
    finalFile?: string,
    listFiles?: ICollector,
}

export interface MyType extends Error {
    httpStatusCode?: number,
}

export interface FileTypeCustom {
    fieldname?: string,
    originalname?: string,
    encoding?: string,
    mimetype?: string,
}

export const CODE_UPLOAD_MULTER=1;

export const CODE_UPLOAD_DEFAULT=2;

export class ArchivoController {

 
    saveMultiControl(req:Request, res:Response):Response {

        const files = req.files;
    
        if (!files) {
      
          return res.status(500).json({status:false,message:'Error procesar archivo'});
        }
      const archivosTransform = files as Array<Express.Multer.File>;
  
      const archivos = archivosTransform.map((item)=>item.originalname);
      /*
      {
      fieldname: 'archivosuser',
      originalname: 'Captura de pantalla_2021-12-10_10-40-35.png',
      encoding: '7bit',
      mimetype: 'image/png'
      }
      */
    
      return res.status(200).json({files:archivos,status:true});

        // return upload.array('archivouser',4)(req, res, function (errN:unknown) {
            
        //         const err = errN as MyType;

        //         const files = req.files;

        //         if (!files) {
                
        //             return res.status(500).json({status:false,message:'Error procesar archivo'});
        //         }
            
        //         if (err instanceof multer.MulterError) {
        //             return res.status(500).send({ message: `Multer uploading error: ${err.message}` ,code:CODE_UPLOAD_MULTER}).end();
        //         } else if (err) {
        //             //Errores que no son de multer
        //             console.log(err.message);
        //             return res.status(500).send({ message: `uploading error: ${err.message}`,code:CODE_UPLOAD_DEFAULT }).end();
        //         }

        //         const archivosTransform = files as Array<Express.Multer.File>;
    
        //         const archivos = archivosTransform.map((item)=>item.originalname);

        //         return res.status(200).json({files:archivos,status:true});
        
        //     }
        // );
    }

    saveOne(req:Request, res:Response, next:NextFunction):Response{
        try{

            const file = req.file as Express.Multer.File;

            if (!file) {
                return res.status(500).json({status:false,message:'Error procesar archivo'});
            }
        
            return res.send(`Archivo <b>${file.originalname}</b> subido exitosamente`)

      } catch (error:unknown) {
        const err = error as MyType
        err.httpStatusCode = 500;
        throw new Error(`Error en la funcionalidad filename: ${err.message}`);
      }
    }

    saveMulti(req:Request, res:Response, next:NextFunction):Response{

        const files = req.files;
    
          if (!files) {
        
            return res.status(500).json({status:false,message:'Error procesar archivo'});
          }
        const archivosTransform = files as Array<Express.Multer.File>;
    
        const archivos = archivosTransform.map((item)=>item.originalname);
        /*
        {
        fieldname: 'archivosuser',
        originalname: 'Captura de pantalla_2021-12-10_10-40-35.png',
        encoding: '7bit',
        mimetype: 'image/png'
        }
        */
      
        return res.status(200).json({files:archivos,status:true});
    }

}