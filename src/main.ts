import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const fastifyApp = app.getHttpAdapter().getInstance() as FastifyInstance;
  await fastifyApp.register(cors, {
    origin: 'http://localhost:3000',
    credentials: true
  });

  await app.listen(3000, '0.0.0.0');
}
bootstrap(); 
