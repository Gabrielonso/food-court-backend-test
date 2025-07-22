import { NestFactory } from '@nestjs/core';
import { OrderModule } from './orders/orders.module';
import { ConfigService } from '@nestjs/config';
import { RabbitMqService } from 'libs/shared';

async function bootstrap() {
  const app = await NestFactory.create(OrderModule);
  const configService = app.get(ConfigService);

  const rabbitmqService = app.get(RabbitMqService);

  const queue = configService.get<string>('RABBITMQ_ORDER_QUEUE');

  app.connectMicroservice(rabbitmqService.getRmqOptions(queue));

  await app.startAllMicroservices();
}
bootstrap();
