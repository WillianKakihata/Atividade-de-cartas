import { Body, Controller, Get, HttpException, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardsDto } from './dto/create-cards.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/decorators/roles.decorators';
import { UserType } from 'src/users/enum/user-type.enum';
import { RolesGuard } from 'src/guards/roles.guards';

@UseGuards(AuthGuard, RolesGuard)
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Roles(UserType.Admin)
  @Get('generate')
  async generateCards(): Promise<CreateCardsDto> {
    try {
      return await this.cardsService.generate(); 
    } catch (e) {
      throw new HttpException(
        { message: 'Erro ao gerar as cartas' },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post()
  async create(@Request() req): Promise<CreateCardsDto> {
    try {
      const generatedCards = await this.cardsService.generate(); 
      const userId = req.user.userId; 
      return await this.cardsService.create(generatedCards, req); 
    } catch (e) {
      console.error('Erro ao criar cartas:', e);
      throw new HttpException(
        { message: 'Erro ao criar as cartas', error: e.message },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Roles(UserType.Admin)
  @Get('find')
  async findCards(): Promise<any> {
    try {
      const cards = await this.cardsService.find();
      return cards;
    } catch (error) {
      throw new HttpException(
        { message: 'Erro ao encontrar baralhos' },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get('my-decks')
  async getMyDecks() {
    const decks = await this.cardsService.findDecksByUser();
    return decks;
  }

  @Post('import')
  async importDeck(@Body() createCardsDto: CreateCardsDto,@Request() req): Promise<any> {
    try {
      return await this.cardsService.create(createCardsDto,req);
    } catch (e) {
      throw new HttpException(
        { message: 'Erro ao importar o baralho', error: e.message },
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
