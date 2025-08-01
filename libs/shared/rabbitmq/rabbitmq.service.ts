import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqContext, RmqOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class RabbitMqService {
  constructor(private readonly configService: ConfigService) {}

  getRmqOptions(queue?: string, noAck = false): RmqOptions {
    const USER = this.configService.get<string>('RABBITMQ_USER');
    const PASSWORD = this.configService.get<string>('RABBITMQ_PASS');
    const HOST = this.configService.get<string>('RABBITMQ_HOST');

    return {
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${USER}:${PASSWORD}@${HOST}`],
        noAck,
        queue,
        persistent: true,
        queueOptions: {
          durable: true,
        },
      },
    };
  }

  acknowledgeMessage(context: RmqContext) {
    const channel = context.getChannelRef() as { ack: (msg: unknown) => void };
    const message = context.getMessage();
    channel.ack(message);
  }
}
