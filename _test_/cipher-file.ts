import { expect } from "chai";
import { v4 as uuid } from 'uuid';
import { appconfig } from "../src/initconfig/configure";
import { CipherFile } from '../src/services/cipher';
import * as fs from 'fs';
import { unlinkSync } from 'fs';

const encrypt = new CipherFile({
    algorithm:appconfig.encrypt.algorithm,
    secretKey:appconfig.encrypt.secretKey
  });

describe('Test CipherFile UNIT',() => {

    

    before(async function(){
        console.log("###############BEGIN TEST#################");
    
        const writableStreamEvent = fs.createWriteStream('sample.txt');

        writableStreamEvent.on('finish', function () {
            console.log('file has been written ORIG!');
        });

        writableStreamEvent.write('Esto es un ejemplo de construcción de cryptografia!\n');

        writableStreamEvent.end();
        
    });

    after(async () => {

        console.log("###############CLEAR DB TEST#################");

        unlinkSync("sample.txt");

        unlinkSync("sampleEnc.txt");
    });

    describe('Add un linkuser', () => {
        it('debería agregar un link user', async () => {
            
            const readableStreamEvent = fs.createReadStream('sample.txt');

            const writableStreamEventEnc = fs.createWriteStream('sampleEnc.txt');

            readableStreamEvent.on('data', function (chunkBuffer:Buffer) { // Could be called multiple times
            
                const buffer = encrypt.encrypt(Buffer.from(chunkBuffer).toString());

                writableStreamEventEnc.write(buffer);

                console.log('got chunk of', chunkBuffer.length, 'bytes');
            });

            const blockEnc:Buffer[] = [];

            readableStreamEvent.on('end', function() {
                // Called after all chunks read
                console.log('got all the data ENC');
                writableStreamEventEnc.end();

                //DEC

                const readableStreamEventDec = fs.createReadStream('sampleEnc.txt');
    
                readableStreamEventDec.on('data', function (chunkBuffer:Buffer) { // Could be called multiple times
                    
                    console.log('Dec got chunk of', chunkBuffer.length, 'bytes');
                    
                    blockEnc.push(Buffer.from(encrypt.decrypt(chunkBuffer)));
                });

            
                readableStreamEventDec.on('end', function() {
                    // Called after all chunks read
                    console.log('got all the data DEC');

                    expect(Buffer.concat(blockEnc).toString()).to.be.equal('Esto es un ejemplo de construcción de cryptografia!\n');

                });
    
                readableStreamEventDec.on('error', function (err) {
                    console.error('got error', err);
                });

            });
            
        });
      });

});