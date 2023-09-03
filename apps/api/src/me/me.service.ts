import { Injectable } from '@nestjs/common';

@Injectable()
export class MeService {
  async getCurrentUser(user) {
    return user;
  }
}
