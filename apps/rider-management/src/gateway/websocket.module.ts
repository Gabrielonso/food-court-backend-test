import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';

@Module({
  imports: [],
  providers: [EventsGateway],
  exports: [EventsGateway],
})
export class WebSocketsModule {}
