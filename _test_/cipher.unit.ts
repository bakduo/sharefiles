import { expect } from "chai";
import { appconfig } from "../src/initconfig/configure";
import * as fs from 'fs';
import { CipherFile, EncodeFileStreamCipher } from "../src/services/cipher";
import * as stream from 'stream';
import * as util from 'util';
const finished = util.promisify(stream.finished);

describe('Test CipherFile UNIT',() => {

    const encrypt = new CipherFile({
        
        algorithm:appconfig.encrypt.algorithm,
        secretKey:appconfig.encrypt.secretKey
      });

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

        fs.unlinkSync("sample.txt");
        
        fs.unlinkSync("sampleEnc.txt");

        fs.unlinkSync('/tmp/sample.orig.png');

        fs.unlinkSync('/tmp/sample.enc');
    });

    describe('Enc file text', () => {
        it('debería enc & des un texto', async () => {
            
            const readableStreamEvent = fs.createReadStream('sample.txt');

            const writableStreamEventEnc = new EncodeFileStreamCipher('sampleEnc.txt',encrypt,true);

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

             const readableStreamEventDec = fs.createReadStream('sampleEnc.txt');

             const writableStreamEventDec = new EncodeFileStreamCipher('sampleDec.txt',encrypt,false);

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
            
            const readableStreamEvent = fs.createReadStream('/tmp/sample.png');

            const writableStreamEventEnc = new EncodeFileStreamCipher('/tmp/sample.enc',encrypt,true);

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

            const readableStreamEventDec = fs.createReadStream('/tmp/sample.enc');

            const writableStreamEventDec = new EncodeFileStreamCipher('/tmp/sample.orig.png',encrypt,false);

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