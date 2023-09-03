import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Account } from '@deal/models';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { SessionSerializer } from './session.serializer';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account]),
    PassportModule.register({ session: true }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, SessionSerializer],
})
export class AuthModule {}
