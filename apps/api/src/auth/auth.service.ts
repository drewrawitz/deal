import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignupDto } from '@deal/dto';
import { Account } from '@deal/models';
import { Repository } from 'typeorm';
import { CurrentUser } from '@deal/types';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Account)
    private readonly repo: Repository<Account>,
  ) {}

  async signup(body: SignupDto) {
    try {
      const { email, password, username } = body;
      const account = this.repo.manager.create(Account, {
        email: email.toLowerCase(),
        password,
        user: {
          username,
        },
      });

      const savedAccount = await this.repo.manager.save(account);

      // Remove the password property from the returned object
      delete savedAccount.password;

      return savedAccount;
    } catch (err) {
      console.error('Error signing up:', err);

      // Check if the error is due to a unique constraint violation on the email column.
      if (err.code === '23505' && err.detail.includes('email')) {
        throw new BadRequestException('Email already exists.');
      }

      // Throw a generic error
      throw new BadRequestException(
        'An error occurred while signing up. Please try again.',
      );
    }
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<CurrentUser | null> {
    try {
      // Retrieve the account with the password explicitly selected
      const account = await this.repo.manager
        .createQueryBuilder(Account, 'account')
        .addSelect('account.password')
        .leftJoinAndSelect('account.user', 'user')
        .where('account.email = :email', { email: email.toLowerCase() })
        .getOne();

      if (!account) {
        throw new UnauthorizedException('Invalid credentials.');
      }

      // Compare the password entered by the user with the stored hashed password
      const isPasswordValid = await bcrypt.compare(password, account.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials.');
      }

      delete account.password;

      return {
        id: account.id,
        email: account.email,
        user_id: account.user.id,
        username: account.user.username,
      };
    } catch (err) {
      throw err;
    }
  }
}
