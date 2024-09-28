import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { CardsSchema } from './cards.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'cards', schema: CardsSchema }]), 
  ],
  providers: [CardsService],
  controllers: [CardsController],
})
export class CardsModule {}
