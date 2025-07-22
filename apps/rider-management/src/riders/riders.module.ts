import { Module } from '@nestjs/common';
import { RiderController } from './riders.controller';
import { RiderService } from './riders.service';
import { ConfigModule } from '@nestjs/config';
import knexConfig from '../knexfile';
import { DatabaseModule, RabbitMqModule } from 'libs/shared';
import { WebSocketsModule } from '../gateway/websocket.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: './.env' }),
    RabbitMqModule,
    DatabaseModule.forRoot({
      config: knexConfig[process.env.NODE_ENV || 'develpment'],
    }),
    WebSocketsModule,
  ],
  controllers: [RiderController],
  providers: [RiderService],
})
export class RiderModule {}
