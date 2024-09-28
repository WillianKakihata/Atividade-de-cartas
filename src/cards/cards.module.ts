import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { Cards, CardsSchema } from './cards.schema';
import { ContextService } from 'src/auth/context.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cards.name, schema: CardsSchema }]), 
  ],
  controllers: [CardsController],
  providers: [CardsService, ContextService],
  exports: [CardsService],
})
export class CardsModule {}
