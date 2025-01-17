import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({
    origin: ['http://localhost:5173'], // Permitir orígenes específicos
    methods: 'GET,HEAD,POST,PUT,DELETE,PATCH,OPTIONS', // Métodos HTTP permitidos
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
