import {
  Controller,
  Request,
  Post,
  Body,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from '@deal/dto';
import { LocalAuthGuard } from './local.auth.guard';
import { Request as RequestType } from 'express';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() body: SignupDto) {
    return this.authService.signup(body);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req: RequestType) {
    return req.user;
  }

  @Get('/logout')
  logout(@Request() req: RequestType) {
    req.session.destroy(() => {
      return;
    });

    return {
      success: true,
    };
  }
}
