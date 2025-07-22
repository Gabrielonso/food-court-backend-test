import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';
import { Knex } from 'knex';
import { RabbitMqService } from 'libs/shared';
import { InjectConnection } from 'nestjs-knex';
import { UpdateRiderLocationDto } from './dto/update-rider-location.dto';
import { EventsGateway } from '../gateway/events.gateway';
import { Rider } from '../models/rider.model';
import { haversineDistance } from 'libs/shared/utils/distance.utils';
import { CalculatedOrder } from '../models/calculated-order.model';
import { Order } from '../models/order.model';

@Injectable()
export class RiderService {
  constructor(
    @InjectConnection() private readonly knex: Knex,
    private readonly rabbitmqservice: RabbitMqService,
    private readonly dispatchEventGateway: EventsGateway,
  ) {}

  async getAvailableRiders(
    context: RmqContext,
    data: { calculatedOrder: CalculatedOrder; order: Order },
  ) {
    // eslint-disable-next-line no-useless-catch
    try {
      const availableRiders: Rider[] | [] = await this.knex('riders').where({
        is_available: true,
      });

      const { calculatedOrder, order } = data;

      this.rabbitmqservice.acknowledgeMessage(context);

      const nearbyAvailableRiders: Rider[] = this.getNearbyAvailableRiders(
        Number(calculatedOrder.lat),
        Number(calculatedOrder.lng),
        availableRiders,
      );
      if (nearbyAvailableRiders?.length) {
        for (const rider of availableRiders) {
          this.dispatchEventGateway.sendOrderToRIder(rider.id, order);
        }
      }
    } catch (error) {
      throw error;
    }
  }

  private getNearbyAvailableRiders(
    restaurantLat: number,
    restaurantLng: number,
    riders: Rider[],
    radiusKm = 5,
  ): Rider[] {
    return riders.filter((rider) => {
      if (!rider.is_available) return false;

      const distance = haversineDistance(
        restaurantLat,
        restaurantLng,
        Number(rider.current_latitude),
        Number(rider.current_longitude),
      );

      return distance <= radiusKm;
    });
  }

  async updateRiderLocation(body: UpdateRiderLocationDto) {
    const { latitude, longitude, riderId } = body;

    const updated = await this.knex('riders').where({ id: riderId }).update({
      current_latitude: latitude,
      current_longitude: longitude,
    });
    if (!updated) {
      throw new NotFoundException('Rider not found');
    }
    // Fetch updated rider info for broadcasting
    const rider = await this.knex('riders')
      .where({ id: riderId })
      .first<Rider>();

    if (rider) {
      this.dispatchEventGateway.broadcastRiderLiveLocation(rider);
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully updated location',
      data: body,
    };
  }
}
