import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from 'mongoose';
import { UserType } from "../enum/user-type.enum";
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
    @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
    _id: mongoose.Schema.Types.ObjectId;

    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ required: true })
    password: string;

    @Prop({ type: [String], enum: UserType, default: [UserType.User] }) 
    roles: UserType[];

    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    email: string;
}

export const UserShema = SchemaFactory.createForClass(User);
