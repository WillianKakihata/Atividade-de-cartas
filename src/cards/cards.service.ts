import { BadRequestException, Injectable } from "@nestjs/common";
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
    this.validateDeck(createCardDto);
    const card = new this.cardsModel({
      ...createCardDto,
      userId,
    });
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
        'https://api.magicthegathering.io/v1/cards?supertypes=legendary&types=creature'
    );
    const commanderCards = response.data.cards;
    if (commanderCards.length === 0) {
        throw new BadRequestException("Nenhuma criatura lendária encontrada.");
    }
    return commanderCards[Math.floor(Math.random() * commanderCards.length)];
}

  private async get99NonLegendaryCards(colors: string[]): Promise<any[]> {
    const colorQuery = colors.join(',');
    const allNonLegendaryCards = [];
    const maxPages = 3; 
    let currentPage = 1;

    while (currentPage <= maxPages) {
        const response: AxiosResponse = await axios.get(
            `https://api.magicthegathering.io/v1/cards?colors=${colorQuery}&supertypes!=legendary&page=${currentPage}`
        );
        const nonLegendaryCards = response.data.cards;

        if (nonLegendaryCards.length === 0) {
            break;
        }

        allNonLegendaryCards.push(...nonLegendaryCards);
        currentPage++;
    }

    console.log('Total de cartas não lendárias retornadas:', allNonLegendaryCards.length);
    return this.getRandomCards(allNonLegendaryCards, 99);
}

private getRandomCards(cards: any[], count: number): any[] {
  const selectedCards = new Set();

  while (selectedCards.size < count) {
      const randomIndex = Math.floor(Math.random() * cards.length);
      const randomCard = cards[randomIndex];

      if (!selectedCards.has(randomCard.name)) {
          selectedCards.add(randomCard.name);
      } else {
          let newCardFound = false;
          for (let i = 0; i < cards.length; i++) {
              const newRandomCard = cards[Math.floor(Math.random() * cards.length)];
              if (!selectedCards.has(newRandomCard.name)) {
                  selectedCards.delete(randomCard.name); 
                  selectedCards.add(newRandomCard.name); 
                  console.log(`Substituindo ${randomCard.name} por ${newRandomCard.name}`);
                  newCardFound = true;
                  break; 
              }
          }
          if (!newCardFound && selectedCards.size < count) {
              console.warn('Não há mais cartas disponíveis para substituir.');
              break;
          }
      }

      if (selectedCards.size >= cards.length) {
          console.warn('Todas as cartas disponíveis foram selecionadas. Adicione mais cartas.');
          break;
      }
  }

  if (selectedCards.size !== count) {
      throw new BadRequestException('Não há cartas suficientes para completar o baralho. O baralho deve conter exatamente 99 cartas além do comandante.');
  }

  return Array.from(selectedCards).map(name => cards.find(card => card.name === name));
}
  
  private getCardName(card: any): string {
    return card.name;
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
  
  private async validateDeck(createCardDto: CreateCardsDto): Promise<void> {
    const { cardCommander, cards } = createCardDto;
  

    if (!await this.isLegendaryCreature(cardCommander)) {
      throw new BadRequestException("O comandante não é uma criatura lendária.");
    }
  
    if (cards.length !== 99) {
      throw new BadRequestException("O baralho deve conter exatamente 99 cartas além do comandante.");
    }
  
    const commanderColors = await this.getCommanderColors(cardCommander);
    const invalidCards = cards.filter(card => !this.isCardInCommanderColors(card, commanderColors));
    if (invalidCards.length > 0) {
      throw new BadRequestException(`As seguintes cartas não seguem a identidade de cor do comandante: ${invalidCards.join(', ')}`);
    }
  
    const cardCounts = this.countCards(cards);
    const duplicateCards = Object.keys(cardCounts).filter(card => cardCounts[card] > 1 && !this.isBasicLand(card));
    if (duplicateCards.length > 0) {
      throw new BadRequestException(`O baralho contém cartas duplicadas, exceto terrenos básicos: ${duplicateCards.join(', ')}`);
    }
  }
  
  private async isLegendaryCreature(cardCommander: string): Promise<boolean> {
    const response = await axios.get(`https://api.magicthegathering.io/v1/cards?name=${encodeURIComponent(cardCommander)}`);
    const cardData = response.data.cards.find(card => card.name === cardCommander);
    return cardData && cardData.supertypes.includes('Legendary') && cardData.types.includes('Creature');
  }
  
  private async getCommanderColors(cardCommander: string): Promise<string[]> {

    const response = await axios.get(`https://api.magicthegathering.io/v1/cards?name=${encodeURIComponent(cardCommander)}`);
    const cardData = response.data.cards.find(card => card.name === cardCommander);
    return cardData ? cardData.colors || [] : [];
  }
  
  private isCardInCommanderColors(card: string, commanderColors: string[]): boolean {

    const cardColors = this.getCardColors(card);
    return cardColors.every(color => commanderColors.includes(color));
  }
  
  private getCardColors(card: string): string[] {
    const mockCardColors: { [key: string]: string[] } = {
      "Plains": ["W"],
      "Island": ["U"],
      "Swamp": ["B"],
      "Mountain": ["R"],
      "Forest": ["G"],
    };
    return mockCardColors[card] || [];
  }
  
  private countCards(cards: string[]): { [card: string]: number } {
    return cards.reduce((acc, card) => {
      acc[card] = (acc[card] || 0) + 1;
      return acc;
    }, {});
  }
  
  private isBasicLand(card: string): boolean {
    return ["Plains", "Island", "Swamp", "Mountain", "Forest"].includes(card);
  }

  
}
