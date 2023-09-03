import { Request, Controller, Get, UseGuards } from '@nestjs/common';
import { MeService } from './me.service';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { Request as RequestType } from 'express';

@Controller({
  path: 'me',
  version: '1',
})
export class MeController {
  constructor(private readonly meService: MeService) {}

  @UseGuards(AuthenticatedGuard)
  @Get()
  async getCurrentUser(@Request() req: RequestType) {
    return req.user;
  }
}
