import { connect, Connection, createConnection } from 'mongoose';

export class MongoConnect {

    private url:string;

    private connection: Connection;

    private static instance: MongoConnect;

    private constructor(url:string,user:string,pass:string,dbname:string){
        this.url = url;
        this.connection = createConnection(this.url, {
            ssl: true,
            dbName:dbname,
            user:user,
            pass:pass
            
          });
    }

    public static getInstance(url:string,user:string,pass:string,dbname:string): MongoConnect {
        if (!MongoConnect.instance) {
            MongoConnect.instance = new MongoConnect(url,user,pass,dbname);
        }

        return MongoConnect.instance;
    }
    
    connect():void{

        // const conectar = async () => {
        // }
        // conectar();
    }

    getConnection():Connection{
        return this.connection;
    }
}