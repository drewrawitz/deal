import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Card } from '@deal/models';
import { CardsService } from './cards.service';

@Module({
  imports: [TypeOrmModule.forFeature([Card])],
  providers: [CardsService],
  exports: [CardsService],
})
export class CardsModule {}
