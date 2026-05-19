import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateShippingAddressDto } from './dto/shipping-address.dto'

@Injectable()
export class ShippingAddressesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: number) {
    return this.prisma.shippingAddress.findMany({ where: { userId } })
  }

  async create(userId: number, dto: CreateShippingAddressDto) {
    if (dto.isDefault) {
      await this.prisma.shippingAddress.updateMany({
        where: { userId },
        data: { isDefault: false },
      })
    }
    return this.prisma.shippingAddress.create({
      data: { userId, ...dto },
    })
  }

  async remove(id: number, userId: number) {
    const address = await this.prisma.shippingAddress.findFirst({ where: { id } })
    if (!address) throw new NotFoundException('배송지가 없습니다.')
    if (address.userId !== userId) throw new ForbiddenException('권한이 없습니다.')
    await this.prisma.shippingAddress.delete({ where: { id } })
    return { message: '삭제 완료' }
  }
}
