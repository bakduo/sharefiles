export interface LinkUser {
    url:string;
    uuid:string;
    email?:string;
    timestamp:number;
    deadline:number;
    ephemeral:boolean;
    deleted:boolean;
    pathfile:string;
    _id?:string;
}
