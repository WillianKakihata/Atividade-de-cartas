import { Controller, Get, HttpException, HttpStatus, Post, UseGuards } from '@nestjs/common';
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

  @Roles(UserType.Admin)
  @Get('find')
  async findCards():Promise<any>{
    try {
      const cards = await this.cardsService.find()
      return cards
    } catch (error) {
      throw new HttpException(
        { message: 'Erro ao encontrar baralhos' },
        HttpStatus.BAD_REQUEST
      );
    }
  }


}