import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('partners')
  findPartners() {
    return this.adminService.findPartners();
  }

  @Post('partners')
  createPartner(@Body('name') name: string) {
    return this.adminService.createPartner(name);
  }

  @Patch('partners/:id/active')
  toggleActive(@Param('id') id: string, @Body('isActive') isActive: boolean) {
    return this.adminService.togglePartnerActive(+id, isActive);
  }
}
