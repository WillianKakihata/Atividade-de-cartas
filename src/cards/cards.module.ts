import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { CardsSchema } from './cards.schema'; // Importando o schema

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'cards', schema: CardsSchema }]), // Certifique-se que o nome é 'cards'
  ],
  providers: [CardsService],
  controllers: [CardsController],
})
export class CardsModule {}
