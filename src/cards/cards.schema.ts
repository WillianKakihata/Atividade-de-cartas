import { Prop, Schema, SchemaFactory, raw } from "@nestjs/mongoose";

@Schema()
export class cards{
    @Prop()
    CardCommander: string;

    @Prop()
    cards: string[];
    
}
