import { IGenericDB, IsearchItem } from "../../datasources/storage/generic";
import { LinkUser } from '../links';

import { Model } from 'mongoose';
import { SchemaLinkUser } from "../../schemas/link-user";
import { LinkUserDTO } from '../../dto/link-user';
import { MyType } from "../../controller/archivo";
import { connectionDB, loggerApp } from "../../initconfig/configure";


//Valid for patch object:any = {}
interface IKeyValue {
    [key:string]:string | number;
}

export class MLinkUser implements IGenericDB<LinkUser|LinkUserDTO> {
    
    model: Model<LinkUser>;

    constructor(){
        try {

            this.model = connectionDB.model<LinkUser>('LinkUser',SchemaLinkUser);

        } catch (error:unknown) {
            const err = error as MyType;
            loggerApp.error(`Exception on constructor into MongoDB: ${err.message}`);
            throw new Error("Error to Generated MLinkUser");
        }
    }

    getType(): string {
        return "mongo";
    }

    async findOne (custom: IsearchItem):Promise<LinkUser> {

        const {keycustom, valuecustom} = custom;

        const queryObj:IKeyValue = {};

        queryObj[keycustom] = valuecustom;

        const item = await this.model.findOne(queryObj);
        if (item){
            return item
        }

        throw new Error(`Exception on findOne into MongoDB`);
    }

    async deleteOne(custom: IsearchItem): Promise<boolean> {

        const {keycustom, valuecustom} = custom;

        const queryObj:IKeyValue = {};

        queryObj[keycustom] = valuecustom;
      
        const item = await this.model.deleteOne(queryObj);

        if (item){

            if (item.deletedCount>0){
                return true
            }
        }

        throw new Error(`Exception on deleteOne into MongoDB`);

    }

    async saveOne(item: LinkUserDTO): Promise<LinkUser | LinkUserDTO>{

            try {

                const mItem = {
                    timestamp:Date.now(),
                    ...item
                }

                const newItem:LinkUser = await this.model.create(mItem);

                if (newItem){
                   
                   const {url,deadline,deleted,_id,pathfile,uuid,ephemeral} = newItem;

                   return {url,deadline,deleted,_id,pathfile,uuid,ephemeral};

                }    
                
                throw new Error(`Exception on create into MongoDB`);

            } catch (error:unknown) {
                const err = error as MyType;
                loggerApp.error(`Exception on saveOne into MongoDB: ${err.message}`);
                throw new Error(`Exception on saveOne into MongoDB`);
            }
    }

    async getAll(): Promise<LinkUser[]> {
        
        const allItems = await this.model.find();
        if (allItems){
            return allItems
        }

        throw new Error(`Exception on getAll into MongoDB`);

    }

    async updateOne(id: string, item: LinkUser): Promise<LinkUser> {


            const updateItem = await this.model.findOneAndUpdate({_id:id},item);
            
            if (updateItem){
                return updateItem;
            }

            throw new Error(`Exception on updateOne into MongoDB`);
        
    }

    async deleteAll(): Promise<void> {
        await this.model.deleteMany();
    }

}