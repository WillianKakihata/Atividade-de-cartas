import { Injectable } from "@nestjs/common";
import { CreateCardsDto } from "./dto/create-cards.dto";
import axios, { AxiosResponse } from "axios";

@Injectable()
export class CardsService {

    async generate(): Promise<CreateCardsDto> {
        const cardCommander = await this.apigetCommander();
        const commanderName = cardCommander.name;
        const cards = await this.get99NonLegendaryCards(cardCommander.colors || []);
        const cardNames = cards.map(card => card.name);
    
        const randomCards = {
          cardCommander: commanderName,
          cards: cardNames,
        };
    
        return randomCards;
      }

    async apigetCommander(): Promise<any> {
        const response: AxiosResponse = await axios.get(
          'https://api.magicthegathering.io/v1/cards?supertypes=legendary',
        );
        const commanderCards = response.data.cards;
        const randomCommander =
          commanderCards[Math.floor(Math.random() * commanderCards.length)];
        return randomCommander;
      }

    async get99NonLegendaryCards(colors: string[]): Promise<any[]> {
        const colorQuery = colors.join(',');
        const response: AxiosResponse = await axios.get(
          `https://api.magicthegathering.io/v1/cards?colors=${colorQuery}&supertypes!=legendary`,
        );
        const nonLegendaryCards = response.data.cards;
    
        const randomNonLegendaryCards = [];
        for (let i = 0; i < 99; i++) {
          const randomCard =
            nonLegendaryCards[Math.floor(Math.random() * nonLegendaryCards.length)];
          randomNonLegendaryCards.push(randomCard);
        }
    
        return randomNonLegendaryCards;
      }
}
