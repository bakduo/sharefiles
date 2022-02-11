import * as crypto from "crypto";
import { loggerApp } from "../initconfig/configure";
import { Writable } from 'stream';
import { writeFile } from "fs/promises";
import { MyType } from "../controller";

//based https://github.com/attacomsian/code-examples/tree/master/nodejs/crypto

export interface ICipher {
    algorithm:string;
    secretKey:string;
}

export interface IHashCiper {
    iv:string;
    content:string;
}

export interface ICipherEnc <T> {
    encrypt(block:T):T;
    decrypt(block:T):T;
}

export class EncodeFileStreamCipher extends Writable {
    path: string;
    encfile:ICipherEnc<Buffer>;
    encoding:boolean;
   
    constructor(path: string,enc:ICipherEnc<Buffer>,type:boolean) {
      super();
      this.path = path;
      this.encfile = enc;
      this.encoding = type;
    }
   
    _write(chunk: any, encoding: string, next: (error?: Error) => void) {

        if (this.encoding){
            writeFile(this.path, this.encfile.encrypt(chunk))
        .then(() => next())
        .catch((error) => next(error));
        }else{
            writeFile(this.path, this.encfile.decrypt(chunk))
        .then(() => next())
        .catch((error) => next(error));
        }
    }
}

export class CipherFile implements ICipherEnc<Buffer> {

    algorithm:string;
    secretKey:string;
    iv:Buffer;

    constructor(config:ICipher){
        this.algorithm = config.algorithm;
        this.secretKey = config.secretKey;
        this.iv = crypto.randomBytes(16);
    }

    encrypt = (block:Buffer):Buffer => {

        try {
            const cipher = crypto.createCipheriv(this.algorithm, Buffer.from(this.secretKey), this.iv);
            return Buffer.concat([this.iv,cipher.update(block), cipher.final()]);
        } catch (error:unknown) {
            const err = error as MyType;
            loggerApp.error(`Exception on ecncript token function encrypt: ${err.message}`);            
            throw new Error(`Exception on encrypt into token`);
        }
    };
    
    decrypt = (block:Buffer):Buffer => {

        const iv = block.slice(0, 16);

        block = block.slice(16);
    
        const decipher = crypto.createDecipheriv(this.algorithm, Buffer.from(this.secretKey), iv);
    
        return Buffer.concat([decipher.update(block), decipher.final()]);

    };
    
}

export class CipherEasy implements ICipherEnc<IHashCiper | string> {

    algorithm:string;
    secretKey:string;
    iv:Buffer;

    constructor(config:ICipher){
        this.algorithm = config.algorithm;
        this.secretKey = config.secretKey;
        this.iv = crypto.randomBytes(16);
    }

    encrypt = (block:string):IHashCiper => {


        try {
            const cipher = crypto.createCipheriv(this.algorithm, Buffer.from(this.secretKey), this.iv);
    
            const encrypted = Buffer.concat([cipher.update(block), cipher.final()]);

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
    
    decrypt = (block:IHashCiper):string => {
    
        const decipher = crypto.createDecipheriv(this.algorithm, Buffer.from(this.secretKey), Buffer.from(block.iv, 'hex'));
    
        const decrpyted = Buffer.concat([decipher.update(Buffer.from(block.content, 'hex')), decipher.final()]);
    
        return decrpyted.toString();
    };
    
}