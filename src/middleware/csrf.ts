import csurf from 'csurf';
import { Request,Response,NextFunction } from 'express';

export const protectionMiddleware = csurf({cookie: { key: "__session", httpOnly: true }});

export  const checkToken = async (req:Request,res:Response,next:NextFunction) => {

    const token = req.cookies['__session'];
    
    if (token){
        return next();
    }
    
    return res.status(403).json({error:'Acceso denegado'});
}