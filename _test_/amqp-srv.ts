import { expect } from "chai";
import { Channel, connect as amqpConnect, Connection } from 'amqplib';
import { appconfig } from "../src/initconfig/configure";
import * as fs from 'fs';

const cwd = process.cwd();

const filePath = cwd + '/_test_/asset';

describe('Test message srv UNIT',() => {

    let conn:Connection;
    let ch1:Channel;
    let ch2:Channel;
    let queue:string;

    before(async function(){
        
        console.log("###############BEGIN TEST RABBITMQ#################");
        const opts = {
          cert: fs.readFileSync(`${filePath}/cert.pem`),
          key: fs.readFileSync(`${filePath}/cert.key`),
        };
        
        conn = await amqpConnect(`amqps://${appconfig.rabbitmq.user}:${appconfig.rabbitmq.pass}@${appconfig.rabbitmq.server}:${appconfig.rabbitmq.port}/${appconfig.rabbitmq.vhost}`,opts);
        //conn = await amqpConnect(`amqp://${appconfig.rabbitmq.user}:${appconfig.rabbitmq.pass}@${appconfig.rabbitmq.server}:5672/service-cpu`);
        ch1 = await conn.createChannel();
        ch2 = await conn.createChannel();
        queue = 'qservice-cpu';
    });

    after(async () => {
        ch2.close();
        ch1.close();
        console.log("###############FINISH TEST RABBITMQ#################");
    });

    describe('testing queue message', () => {

        it('deberia enviar payload al queue', async () => {
            const enviado = ch1.sendToQueue(queue, Buffer.from('something to do'));
            expect(enviado).to.be.true;
        });

        it('deberia recibir payload de la queue', async () => {
          ch2.consume(queue, (msg:any) => {
              if (msg !== null) {
                console.log('Recieved:', msg.content.toString());
                ch1.ack(msg);
                expect(msg.content.toString()).to.be.equal('something to do');
              } else {
                console.log('Consumer cancelled by server');
              }
            });
        });

    });

});