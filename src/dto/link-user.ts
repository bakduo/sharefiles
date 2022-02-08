
export interface LinkUserDTO {

    url:string;
    uuid: string;
    email?:string;
    deadline:number;
    ephemeral:boolean;
    pathfile:string;
    deleted:boolean;
    _id?:string;
}