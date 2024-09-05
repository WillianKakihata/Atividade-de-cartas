import { Controller, Get, UseGuards } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardsDto } from './dto/create-cards.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Get('generate')
  async generateCards(): Promise<CreateCardsDto> {
    return this.cardsService.generate();
  }
}
