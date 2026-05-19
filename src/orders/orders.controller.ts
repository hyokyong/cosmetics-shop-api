import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Req,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll(@Req() req: any) {
    return this.ordersService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.ordersService.findOne(+id, req.user.userId);
  }

  @Post()
  create(@Body() dto: CreateOrderDto, @Req() req: any) {
    return this.ordersService.create(req.user.userId, dto);
  }

  @Delete(':id')
  cancel(@Param('id') id: string, @Req() req: any) {
    return this.ordersService.cancel(+id, req.user.userId);
  }
}
