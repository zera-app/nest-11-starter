import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN?.split(',') ?? [
    'http://localhost:3000',
  ];
  const ALLOWED_METHODS = process.env.ALLOWED_METHODS?.split(',') ?? [
    'GET',
    'POST',
    'PUT',
    'DELETE',
    'OPTIONS',
  ];
  const ALLOWED_HEADERS = process.env.ALLOWED_HEADERS?.split(',') ?? [
    'Content-Type',
    'Authorization',
  ];

  app.enableCors({
    origin: ALLOWED_ORIGIN,
    methods: ALLOWED_METHODS,
    allowedHeaders: ALLOWED_HEADERS,
    maxAge: 0,
    credentials: false,
  });

  await app.listen(process.env.APP_BACKEND_PORT ?? 8001);

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
