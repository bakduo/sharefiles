export interface IConfigDB {
    db:{
        mongo:{
            url:string;
            dbname:string;
            user:string;
            pass:string;
            secure:number;
            models:[];
            schema:object;
            ssl:boolean;
        }
    }
    port:number;
    hostname:string;
    secure:boolean;
    protocol:string;
    encrypt:{
        algorithm:string;
        secretKey:string;
        iv:string;
    },
    rootpathfile:string;
    session:{
        secret:string;
    },
    memcached:{
        server:string,
        port:number,
        secret:string;
        ssl:boolean;
    }
}