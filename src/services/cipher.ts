

import * as crypto from "crypto";
import { loggerApp } from "../config/configure";
import { MyType } from "../controller/archivo";

//based https://github.com/attacomsian/code-examples/tree/master/nodejs/crypto

export interface ICipher {
    algorithm:string;
    secretKey:string;
}

export interface IHashCiper {
    iv:string;
    content:string;
}

export class CipherEasy {

    algorithm:string;
    secretKey:string;
    iv:Buffer;

    constructor(config:ICipher){
        this.algorithm = config.algorithm;
        this.secretKey = config.secretKey;
        this.iv = crypto.randomBytes(16);
        //crypto.randomBytes(24);
    }

    encrypt = (text:string):IHashCiper => {


        try {
            const cipher = crypto.createCipheriv(this.algorithm, Buffer.from(this.secretKey), this.iv);
    
            const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

            return {
                iv: this.iv.toString('hex'),//tener en cuenta que debe ser HEX sino crypto.randomBytes(24).toString('hex')
                content: encrypted.toString('hex')
            };

        } catch (error:unknown) {
            const err = error as MyType;
            loggerApp.error(`Exception on ecncript token function encrypt: ${err.message}`);            
            throw new Error(`Exception on encrypt into token`);
        }

    };
    
    decrypt = (hash:IHashCiper):string => {
    
        const decipher = crypto.createDecipheriv(this.algorithm, Buffer.from(this.secretKey), Buffer.from(hash.iv, 'hex'));
    
        const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);
    
        return decrpyted.toString();
    };
    
}