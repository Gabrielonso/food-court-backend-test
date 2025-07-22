import { Module } from '@nestjs/common';
import { OrderController } from './orders.controller';
import { ConfigModule } from '@nestjs/config';
import knexConfig from '../knexfile';
import { OrderService } from './orders.service';

import { RabbitMqModule } from 'libs/shared/rabbitmq/rabbitmq.module';
import { DatabaseModule } from 'libs/shared/database/database.module';
import { RIDER_SERVICE } from '../constants/services';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: './.env' }),
    RabbitMqModule.registerRmq(RIDER_SERVICE, process.env.RABBITMQ_RIDER_QUEUE),
    DatabaseModule.forRoot({
      config: knexConfig[process.env.NODE_ENV || 'develpment'],
    }),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
