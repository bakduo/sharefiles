import { MLinkUser } from './../src/dao/mongo/link-user';
import { expect } from "chai";
import { v4 as uuid } from 'uuid';

const daoLink = new MLinkUser();

describe('Test MLinkUser DAO UNIT',() => {

    before(async function(){
        console.log("###############BEGIN TEST#################");
        
    });

    after(async () => {

        console.log("###############CLEAR DB TEST#################");

        await daoLink.deleteAll();

    });

    describe('Add un linkuser', () => {
        it('debería agregar un link user', async () => {
            
            const url = 'http://localhost:8080';

            const finalDate = new Date((Date.now() + 400000000)).getTime();

            const Oksave = await daoLink.saveOne({
                url:`${url}`,
                uuid:uuid(),
                ephemeral: true,
                deadline:finalDate,
                origname:'origname',
                deleted:false,
                pathfile:'sampleuploads/'
              });

            expect(Oksave).to.be.a('object');

            expect(Oksave).to.include.keys('url','deadline','deleted','pathfile');
        });
      });

});