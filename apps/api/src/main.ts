import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';
import { ConfigService } from '@nestjs/config';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = 5588;

  // Initialize Redis client.
  const redisClient = createClient({
    url: configService.get('REDIS_URL') || 'redis://localhost:6379',
  });
  redisClient.connect().catch(console.error);

  // Initialize Redis store.
  const redisStore = new RedisStore({
    client: redisClient,
  });

  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.enableCors();

  /**
   * Sessions
   */
  app.use(
    session({
      store: redisStore,
      secret: configService.get('SESSION_SECRET'),
      resave: true,
      saveUninitialized: false,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on port ${port}`);
}
bootstrap();
