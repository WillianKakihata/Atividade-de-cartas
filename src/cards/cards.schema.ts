import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CardsDocument = Cards & Document;

@Schema()
export class Cards {
  @Prop({ required: true })
  cardCommander: string;

  @Prop({ type: [String], required: true })
  cards: string[];

  @Prop({ required: true })
  userId: string;
}

export const CardsSchema = SchemaFactory.createForClass(Cards);