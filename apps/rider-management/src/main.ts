import { NestFactory } from '@nestjs/core';
import { RiderModule } from './riders/riders.module';
import { ConfigService } from '@nestjs/config';
import { RabbitMqService } from 'libs/shared';

async function bootstrap() {
  const app = await NestFactory.create(RiderModule);
  const configService = app.get(ConfigService);
  const rabbitmqService = app.get(RabbitMqService);

  const queue = configService.get<string>('RABBITMQ_RIDER_QUEUE');

  app.connectMicroservice(rabbitmqService.getRmqOptions(queue));

  app.startAllMicroservices();
}

bootstrap();
