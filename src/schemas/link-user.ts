import { Schema } from 'mongoose';

import { LinkUser } from "../dao/links";

export const SchemaLinkUser = new Schema<LinkUser>({
    url: {
        type: String,
        required: true,
        default: '',
      },
    origname: {
        type: String,
        required: true,
        default: '',
    },
    uuid: {
        type: String,
        required: true,
        default: '',
      },
    pathfile: {
        type: String,
        required: true,
        default: '',
      },
    email: {
        type: String,
        required: false,
        default: '',
      },  
    deleted:{
        type: Boolean,
        required: true,
        default:false,
    },
    deadline: {
        type: Number,
        required: false,
        default: Math.floor(Date.now() / 1000),
    },  
    timestamp: {
        type: Number,
        required: true,
        default: Math.floor(Date.now() / 1000),
      },
  });