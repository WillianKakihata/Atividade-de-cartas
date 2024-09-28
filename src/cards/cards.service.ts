import { Injectable } from "@nestjs/common";
import { CreateCardsDto } from "./dto/create-cards.dto";
import axios, { AxiosResponse } from "axios";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Cards } from "./cards.schema";
import { ContextService } from "src/auth/context.service";
import { Request } from "express"; 

@Injectable()
export class CardsService {
  constructor(
    @InjectModel(Cards.name) 
    private readonly cardsModel: Model<Cards>,
    private readonly contextService: ContextService
  ) {}

  async create(createCardDto: CreateCardsDto, request: Request): Promise<Cards> {
    const userId = this.contextService.getUserId(); 
    const card = new this.cardsModel({ ...createCardDto, userId }); 
    return await card.save();  
  }

  async generate(): Promise<CreateCardsDto> {
    const userId = this.contextService.getUserId(); 
    const cardCommander = await this.apigetCommander();
    const commanderName = this.getCardName(cardCommander);
    const nonLegendaryCards = await this.get99NonLegendaryCards(cardCommander.colors || []);
    const cardNames = nonLegendaryCards.map(this.getCardName);

    const cards: CreateCardsDto = {
      cardCommander: commanderName,
      cards: cardNames,
      userId: userId,
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

  async find(): Promise<Cards[]> {
    try {
      return await this.cardsModel.find({});
    } catch (e) {
      return null;
    }
  }

  async findDecksByUser(): Promise<any> {
    try {
      const userId = this.contextService.getUserId();
  
      if (!userId) {
        console.error('User ID is undefined');
        return null; 
      }
  
      const decks = await this.cardsModel.find({ userId });
      return decks;  
    } catch (e) {
      console.error('Erro ao encontrar baralhos:', e); 
      return null;
    }
  }
  
}
