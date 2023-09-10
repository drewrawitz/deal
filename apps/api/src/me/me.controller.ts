import { Request, Controller, Get } from '@nestjs/common';
import { MeService } from './me.service';
import { Request as RequestType } from 'express';

@Controller({
  path: 'me',
  version: '1',
})
export class MeController {
  constructor(private readonly meService: MeService) {}

  @Get()
  async getCurrentUser(@Request() req: RequestType) {
    return req.user;
  }
}
