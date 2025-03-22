import { NestFactory } from '@nestjs/core';
import { ClientModule } from './client.module';

async function bootstrap() {
  const app = await NestFactory.create(ClientModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
