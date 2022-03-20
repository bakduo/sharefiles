import { connect, Connection, createConnection } from 'mongoose';

export default class MongoConnect {

    private url:string;

    private connection: Connection;

    private static instance: MongoConnect;

    private constructor(url:string,user:string,pass:string,dbname:string,_secure:boolean){
        this.url = url;

        if (!_secure){
            this.connection = createConnection(this.url, {
                dbName:dbname,
                user:user,
                pass:pass
              });    
        }else{
            this.connection = createConnection(this.url, {
                ssl: true,
                dbName:dbname,
                user:user,
                pass:pass
              });
        }
    }

    public static getInstance(url:string,user:string,pass:string,dbname:string,secure:boolean): MongoConnect {
        if (!MongoConnect.instance) {
            MongoConnect.instance = new MongoConnect(url,user,pass,dbname,secure);
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