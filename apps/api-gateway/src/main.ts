import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';
import { ValidationPipe } from '@nestjs/common';
import {
  AllExceptionsFilter,
  HttpExceptionFilter,
  RabbitMqService,
} from 'libs/shared';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const rabbitmqService = app.get(RabbitMqService);
  const configService = app.get(ConfigService);
  const queue = configService.get<string>('RABBITMQ_API_QUEUE');

  app.connectMicroservice(rabbitmqService.getRmqOptions(queue, true));

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(
    new HttpExceptionFilter(configService),
    new AllExceptionsFilter(httpAdapterHost),
  );
  app.enableCors();
  app.setGlobalPrefix('api');

  await app.startAllMicroservices();
  const port = process.env.PORT || configService.get<number>('PORT') || 5005;
  await app.listen(port);
  const env = configService.get<number>('NODE_ENV');
  console.log(`food-court-api ${env} is up and running!`);
}
bootstrap();
