import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common';
import { envs } from 'config';

async function bootstrap() {
  const logger = new Logger('Main');
  const app = await NestFactory.create(AppModule);

 app.setGlobalPrefix('api/v1');
 // main.ts

 app.useGlobalPipes(
   new ValidationPipe(
     {
       whitelist : true,
       forbidNonWhitelisted : true,
       transform : true
     }
   )
 )

  await app.listen(envs.port);
  logger.log(`Starting Server on port : ${envs.port}`);
}
bootstrap();
