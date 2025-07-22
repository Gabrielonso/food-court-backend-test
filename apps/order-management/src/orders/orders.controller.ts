import { Body, Controller, Get, Post } from '@nestjs/common';
import { OrderService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('')
  getOrders() {
    return this.orderService.getOrders();
  }

  @Post('')
  createOrder(@Body() payload: CreateOrderDto) {
    return this.orderService.createOrder(payload);
  }

  @Get('most-ordered-meal')
  getMostOrderedMeal() {
    return this.orderService.getMostOrderedMeal();
  }
}
