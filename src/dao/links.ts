export interface LinkUser {
    url:string;
    uuid:string;
    email?:string;
    timestamp:number;
    deadline:number;
    ephemeral:boolean;
    deleted:boolean;
    origname:string;
    pathfile:string;
    _id?:string;
}
