/* eslint-disable no-useless-catch */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Knex } from 'knex';
import { InjectConnection } from 'nestjs-knex';
import { RIDER_SERVICE } from '../constants/services';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderType } from '../models/order-type.model';
import { lastValueFrom } from 'rxjs';
import { Order } from '../models/order.model';

@Injectable()
export class OrderService {
  constructor(
    @InjectConnection() private readonly knex: Knex,
    @Inject(RIDER_SERVICE) private riderClient: ClientProxy,
  ) {}

  async getOrders() {
    try {
      const result = await this.knex.raw(`SELECT o.*,
      to_jsonb(co) AS calculated_order,
      to_jsonb(ot) AS order_type,
      COALESCE(
        (
          SELECT jsonb_agg(to_jsonb(l))
          FROM logs l
          WHERE l.calculated_order_id = o.id
        ),
        '[]'::jsonb
      ) AS logs,
         COALESCE(
        (
          SELECT jsonb_agg(to_jsonb(otah))
          FROM order_total_amount_history otah
          WHERE otah.order_id = o.id
        ),
        '[]'::jsonb
      ) AS order_total_amount_history FROM orders o
    LEFT JOIN calculated_orders co ON co.id = o.calculated_order_id
    LEFT JOIN order_types ot ON ot.id = o.order_type_id
    ORDER BY o.created_at DESC;`);
      //     const result = await this.knex.raw(`SELECT
      //   o.*,
      //   jsonb_build_object(
      //     'id', co.id,
      //     'order_id', co.order_id,
      //     'total', co.total,
      //     'meals', COALESCE((
      //       SELECT jsonb_agg(to_jsonb(m))
      //       FROM ordered_meals om
      //       JOIN meals m ON m.id = om.meal_id
      //       WHERE om.calculated_order_id = co.id
      //     ), '[]'::jsonb)
      //   ) AS calculated_order,
      //   to_jsonb(ot) AS order_type,
      //   COALESCE((
      //     SELECT jsonb_agg(to_jsonb(l))
      //     FROM logs l
      //     WHERE l.order_id = o.id
      //   ), '[]'::jsonb) AS logs,
      //   COALESCE((
      //     SELECT jsonb_agg(to_jsonb(otah))
      //     FROM order_total_amount_history otah
      //     WHERE otah.order_id = o.id
      //   ), '[]'::jsonb) AS order_total_amount_history
      // FROM orders o
      // LEFT JOIN calculated_orders co ON co.id = o.calculated_order_id
      // LEFT JOIN order_types ot ON ot.id = o.order_type_id
      // ORDER BY o.created_at DESC;`);

      return {
        statusCode: HttpStatus.OK,
        message: 'Request successful',
        data: result.rows || [],
      };
    } catch (error) {
      throw error;
    }
  }

  async createOrder(payload: CreateOrderDto) {
    try {
      return this.knex.transaction(async (trx) => {
        const {
          meals,
          order_type_id,
          total_amount,
          free_delivery,
          delivery_fee,
          service_charge,
          address_details,
          cokitchen_id,
          cokitchen_polygon_id,
          pickup,
          prev_price,
          user_id,
          box_number,
        } = payload;
        const validMeals = await trx('meals')
          .select('id')
          .whereIn('id', meals)
          .andWhere({ is_deleted: false });
        if (validMeals.length !== meals.length) {
          throw new BadRequestException('One or more meals are invalid');
        }

        const validOrderType = await trx('order_types')
          .select('id')
          .where('id', order_type_id)
          .first<OrderType>();
        if (!validOrderType) {
          throw new BadRequestException('Invalid order_type_id');
        }

        const [calculatedOrder] = await trx('calculated_orders')
          .insert({
            total_amount,
            free_delivery,
            delivery_fee,
            service_charge,
            address_details: JSON.stringify(address_details),
            lat: String(address_details.lat),
            lng: String(address_details.lng),
            cokitchen_polygon_id: cokitchen_polygon_id,
            user_id: user_id,
            cokitchen_id: cokitchen_id,
            pickup: pickup,
            prev_price: prev_price,
          })
          .returning('*');

        const mealInserts = meals.map((mealId) => ({
          calculated_order_id: calculatedOrder.id,
          meal_id: mealId,
        }));

        await trx('ordered_meals').insert(mealInserts);

        const orderCode = `ORD-${Date.now()}`;

        const [order] = await trx<Order>('orders')
          .insert({
            user_id,
            order_code: orderCode,
            calculated_order_id: calculatedOrder.id,
            box_number,
            order_type_id,
          })
          .returning('*');

        await trx('logs').insert({
          calculated_order_id: calculatedOrder.id,
          time: new Date(),
          description: `Order ${orderCode} created.`,
        });

        await lastValueFrom(
          this.riderClient.emit('order-created', { order, calculatedOrder }),
        );

        return {
          message: 'Order created successfully',
          statusCode: HttpStatus.OK,
          data: order,
        };
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getMostOrderedMeal() {
    try {
      const result = await this.knex('ordered_meals as om')
        .join('meals as m', 'om.meal_id', 'm.id')
        .select('m.name')
        .count('* as total_orders')
        .groupBy('m.id', 'm.name')
        .orderBy('total_orders', 'desc')
        .first();

      return {
        statusCode: HttpStatus.OK,
        message: 'Operation successful',
        data: result,
      };
    } catch (error) {
      throw error;
    }
  }
}
