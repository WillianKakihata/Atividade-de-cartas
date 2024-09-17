import { Injectable } from "@nestjs/common";
import { CreateCardsDto } from "./dto/create-cards.dto";
import axios, { AxiosResponse } from "axios";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Cards } from "./cards.schema";

@Injectable()
export class CardsService {
  constructor(@InjectModel('cards') private readonly cardsModel: Model<Cards>) {} 

  async create(createCardDto: CreateCardsDto): Promise<Cards> {
    const card = new this.cardsModel(createCardDto); 
    return await card.save();  
  }

    async generate(): Promise<CreateCardsDto> {
        const cardCommander = await this.apigetCommander();
        const commanderName = this.getCardName(cardCommander);
        const nonLegendaryCards = await this.get99NonLegendaryCards(cardCommander.colors || []);
        const cardNames = nonLegendaryCards.map(this.getCardName);
    
        const cards: CreateCardsDto = {
          "cardCommander": commanderName,
          "cards": cardNames,
        };

        return cards;
      }
    
      private async apigetCommander(): Promise<any> {
        const response: AxiosResponse = await axios.get(
          'https://api.magicthegathering.io/v1/cards?supertypes=legendary',
        );
        const commanderCards = response.data.cards;
        return commanderCards[Math.floor(Math.random() * commanderCards.length)];
      }
    
      private async get99NonLegendaryCards(colors: string[]): Promise<any[]> {
        const colorQuery = colors.join(',');
        const response: AxiosResponse = await axios.get(
          `https://api.magicthegathering.io/v1/cards?colors=${colorQuery}&supertypes!=legendary`,
        );
        const nonLegendaryCards = response.data.cards;
        
        return this.getRandomCards(nonLegendaryCards, 99);
      }
    
      private getCardName(card: any): string {
        return card.name;
      }
    
      private getRandomCards(cards: any[], count: number): any[] {
        const randomCards = [];
        for (let i = 0; i < count; i++) {
          const randomCard = cards[Math.floor(Math.random() * cards.length)];
          randomCards.push(randomCard);
        }
        return randomCards;
      }
}
