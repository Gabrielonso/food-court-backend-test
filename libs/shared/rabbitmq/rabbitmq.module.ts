import { DynamicModule, Module } from '@nestjs/common';
import { RabbitMqService } from './rabbitmq.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  providers: [RabbitMqService],
  exports: [RabbitMqService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
  ],
})
export class RabbitMqModule {
  static registerRmq(service: string, queue?: string): DynamicModule {
    const providers = [
      {
        provide: service,
        useFactory: (configService: ConfigService) => {
          const USER = configService.get<string>('RABBITMQ_USER');
          const PASSWORD = configService.get<string>('RABBITMQ_PASS');
          const HOST = configService.get<string>('RABBITMQ_HOST');

          return ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
              urls: [`amqp://${USER}:${PASSWORD}@${HOST}`],
              queue,
              queueOptions: {
                durable: true,
              },
            },
          });
        },
        inject: [ConfigService],
      },
    ];
    return {
      module: RabbitMqModule,
      providers,
      exports: providers,
    };
  }
}
