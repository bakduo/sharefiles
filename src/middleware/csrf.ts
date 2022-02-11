import csurf from 'csurf';
import * as express from 'express';

export const protectionMiddleware = csurf({cookie: { key: "__session", httpOnly: true }});

export function checkToken(req:express.Request,res:express.Response,next:express.NextFunction){

    const token = req.cookies['__session'];
    
    if (token){
        return next();
    }
    
    return res.status(403).json({error:'Acceso denegado'});
}