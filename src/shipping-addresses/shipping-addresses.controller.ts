import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Req,
} from '@nestjs/common';
import { ShippingAddressesService } from './shipping-addresses.service';
import { CreateShippingAddressDto } from './dto/shipping-address.dto';

@Controller('shipping-addresses')
export class ShippingAddressesController {
  constructor(private readonly service: ShippingAddressesService) {}

  @Get()
  findAll(@Req() req: any) {
    return this.service.findAll(req.user.userId);
  }

  @Post()
  create(@Body() dto: CreateShippingAddressDto, @Req() req: any) {
    return this.service.create(req.user.userId, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.service.remove(+id, req.user.userId);
  }
}
