import { Body, Controller, Logger, Put, UseGuards } from '@nestjs/common';
import { RiderService } from './riders.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { AccessTokenGuard } from 'apps/api-gateway/src/guard/access-token.guard';
import { UpdateRiderLocationDto } from './dto/update-rider-location.dto';

@Controller('riders')
export class RiderController {
  private readonly logger = new Logger();
  constructor(private readonly riderService: RiderService) {}

  //For authorized rider
  //@UseGuards(AccessTokenGuard)
  @Put('me/location')
  updateRiderLocation(@Body() payload: UpdateRiderLocationDto) {
    return this.riderService.updateRiderLocation(payload);
  }

  @EventPattern('order-created')
  async handleOrderCreated(@Payload() data, @Ctx() context: RmqContext) {
    this.logger.log(`A new order is creaated`);
    return this.riderService.getAvailableRiders(context, data);
  }
}
