import { ZodValidationPipe } from 'nestjs-zod';
import { APP_PIPE } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Account, Card } from '@deal/models';
import { AuthModule } from './auth/auth.module';
import { MeModule } from './me/me.module';
import { GamesModule } from './games/games.module';
import { CardsModule } from './cards/cards.module';

@Module({
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [User, Account, Card],
      synchronize: false,
    }),
    AuthModule,
    MeModule,
    CardsModule,
    GamesModule,
  ],
})
export class AppModule {}
