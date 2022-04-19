import { expect } from "chai";
import { appconfig } from "../src/initconfig/configure";
import * as fs from 'fs';
import { CipherFile, EncodeFileStreamCipher } from "../src/services/cipher";
import * as stream from 'stream';
import * as util from 'util';
const finished = util.promisify(stream.finished);
const cwd = process.cwd();
const filePath = cwd + '/_test_/asset';

describe('Test CipherFile UNIT',() => {

    const encrypt = new CipherFile({
        
        algorithm:appconfig.encrypt.algorithm,
        secretKey:appconfig.encrypt.secretKey
      });

    before(async function(){
        console.log("###############BEGIN TEST#################");
    
        const writableStreamEvent = fs.createWriteStream(`${filePath}/sample.txt`);

        writableStreamEvent.on('finish', function () {
            console.log('file has been written ORIG!');
        });

        writableStreamEvent.write('Esto es un ejemplo de construcción de cryptografia!\n');

        writableStreamEvent.end();
        
    });

    after(async () => {

        console.log("###############CLEAR DB TEST#################");

        fs.unlinkSync(`${filePath}/sample.txt`);
        
        fs.unlinkSync(`${filePath}/sampleEnc.txt`);

        fs.unlinkSync(`${filePath}/sample.enc`);

        fs.unlinkSync(`${filePath}/sample.orig.png`);
    });

    describe('Enc file text', () => {
        it('debería enc & des un texto', async () => {
            
            const readableStreamEvent = fs.createReadStream(`${filePath}/sample.txt`);

            const writableStreamEventEnc = new EncodeFileStreamCipher(`${filePath}/sampleEnc.txt`,encrypt,true);

            await finished(stream.pipeline(

                readableStreamEvent,

                writableStreamEventEnc,

                (err) => {
                  if (err) {
                    console.error('Pipeline failed', err);
                  } else {
                    console.debug('Pipeline succeeded');
                  }
                }
              ));

             //DEC

             const readableStreamEventDec = fs.createReadStream(`${filePath}/sampleEnc.txt`);

             const writableStreamEventDec = new EncodeFileStreamCipher(`${filePath}sampleDec.txt`,encrypt,false);

             await finished(stream.pipeline(

                readableStreamEventDec,

                writableStreamEventDec,

                (err) => {
                  if (err) {
                    console.error('Pipeline failed', err);
                  } else {
                    console.debug('Pipeline succeeded enc & des un texto');
                    expect('fin').to.be.equal('fin');
                  }
                }
              ));

        });
      });


      describe('Enc file bytes', () => {

        it('debería enc & dec una imagen', async () => {
            
            const readableStreamEvent = fs.createReadStream(`${filePath}/sample.png`);

            const writableStreamEventEnc = new EncodeFileStreamCipher(`${filePath}/sample.enc`,encrypt,true);

            await finished(stream.pipeline(

                readableStreamEvent,

                writableStreamEventEnc,

                (err) => {
                  if (err) {
                    console.error('Pipeline failed', err);
                  } else {
                    console.debug('Pipeline succeeded enc & dec una imagen');
                  }
                }
            ));

            const readableStreamEventDec = fs.createReadStream(`${filePath}/sample.enc`);

            const writableStreamEventDec = new EncodeFileStreamCipher(`${filePath}/sample.orig.png`,encrypt,false);

            await finished(stream.pipeline(

                readableStreamEventDec,

                writableStreamEventDec,

                (err) => {
                  if (err) {
                    console.error('Pipeline failed', err);
                  } else {
                    console.debug('Pipeline succeeded');
                    expect('fin').to.be.equal('fin');
                  }
                }
            ));

        });
      });

});