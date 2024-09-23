import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from 'mongoose';
import { UserType } from "../enum/user-type.enum";

@Schema()
export class User {
    @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
    _id: mongoose.Schema.Types.ObjectId;
  
    @Prop()
    username: string;
  
    @Prop()
    password: string;
  
    @Prop({ type: [String] }) 
    roles: UserType[];
  
    @Prop()
    name: string;
  
    @Prop()
    email: string;
  }

export const UserShema = SchemaFactory.createForClass(User);