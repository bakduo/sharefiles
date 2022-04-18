import supertest from "supertest";

import { expect } from "chai";

import { app } from '../src/main';

import * as fs from 'fs';

import { parse } from 'node-html-parser';

const request = supertest(app);

describe('Test file upload UNIT',() => {

    
    let token="";

    let cookies:any;

    before(async function(){
        console.log("###############BEGIN TEST#################");

        const tmpJson = [
            {name:'name1',
            service:'service1',
            internal:'internal1'},
            {name:'name2',
            service:'service2',
            internal:'internal2'},
            {name:'name3',
            service:'service3',
            internal:'internal3'},
        ];
        
        fs.writeFileSync('sample.json',JSON.stringify(tmpJson),'utf8');
        
    });

    after(async () => {

        console.log("###############END DB TEST#################");

        fs.unlinkSync('sample.json');
    
    });

    beforeEach(async () => {
        
            const response = await request.get(`/`).send();

            const dom = parse(response.text);

            cookies = response.headers['set-cookie'];

            const metadataDom = dom.querySelector('meta[name="csrf-token"]');

            token = metadataDom?.getAttribute('content') || '';
       
    });

    describe('POST should be failed', () => {

        it('Post file test', async () => {

            const response = await request.post(`/uploadfilescheck`).type('form').set('cookies', cookies).set('CSRF-Token',token).attach('archivosuser', 'sample.json');

            const serviceSave = response.body;

            expect(response.status).to.eql(403);

            expect(serviceSave).to.include.keys('message');

            expect(serviceSave.message).to.eql('Request denied'); 
        })
    })

    describe('No GET file id', () => {
        
        it('Return 404 code', async () => {

            const response = await request.get(`/fsfsdsdssdfs`).send();
            
            expect(response.status).to.eql(403);

            expect(response.body).to.include.keys('status','message');
        
        });

    });


})