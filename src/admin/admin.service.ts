import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async findPartners() {
    return this.prisma.partner.findMany();
  }

  async createPartner(name: string) {
    return this.prisma.partner.create({ data: { name } });
  }

  async togglePartnerActive(id: number, isActive: boolean) {
    return this.prisma.partner.update({ where: { id }, data: { isActive } });
  }
}
