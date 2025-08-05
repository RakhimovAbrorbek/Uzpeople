import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function start() {
  const PORT = process.env.PORT || 3000
  const app = await NestFactory.create(AppModule, { logger: ["debug", "error"] });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
  app.setGlobalPrefix("api")
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  await app.listen(PORT, () => {
    console.log(`Server is running on ${PORT} port`);
  });
}
start();
