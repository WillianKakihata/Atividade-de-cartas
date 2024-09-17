import { Controller, Get, HttpException, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardsDto } from './dto/create-cards.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

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
  async create(): Promise<CreateCardsDto> {
    try {
      const generatedCards = await this.cardsService.generate(); 
      return await this.cardsService.create(generatedCards); 
    } catch (e) {
      throw new HttpException(
        { message: 'Erro ao criar as cartas' },
        HttpStatus.BAD_REQUEST
      );
    }
  }
}