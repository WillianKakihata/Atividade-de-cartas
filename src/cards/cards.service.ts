import { Injectable } from "@nestjs/common";
import { CreateCardsDto } from "./dto/create-cards.dto";
import axios, { AxiosResponse } from "axios";

@Injectable()
export class CardsService {

    async generate(): Promise<CreateCardsDto> {
        const cardCommander = await this.apigetCommander();
        const commanderName = this.getCardName(cardCommander);
        const nonLegendaryCards = await this.get99NonLegendaryCards(cardCommander.colors || []);
        const cardNames = nonLegendaryCards.map(this.getCardName);
    
        return {
          cardCommander: commanderName,
          cards: cardNames,
        };
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
