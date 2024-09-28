import { IsArray, IsOptional, IsString } from "class-validator";

export class CreateCardsDto {
  @IsString()
  cardCommander: string;

  @IsArray()
  cards: string[];

  @IsString()
  userId: string; 
}
