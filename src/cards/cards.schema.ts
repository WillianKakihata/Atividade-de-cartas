import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

@Schema()
export class Cards extends Document {
    @Prop({ required: true })  
    cardCommander: string;

    @Prop({ type: [String], default: [] })  
    cards: string[];
}

export const CardsSchema = SchemaFactory.createForClass(Cards);
