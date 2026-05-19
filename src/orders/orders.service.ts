import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { orderItems: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number, userId: number) {
    const order = await this.prisma.order.findFirst({
      where: { id, userId },
      include: { orderItems: { include: { product: true } } },
    });
    if (!order) throw new NotFoundException('주문이 없습니다.');
    return order;
  }

  async create(userId: number, dto: CreateOrderDto) {
    return this.prisma.order.create({
      data: {
        userId,
        orderItems: {
          create: dto.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { orderItems: true },
    });
  }

  async cancel(id: number, userId: number) {
    const order = await this.prisma.order.findFirst({ where: { id, userId } });
    if (!order) throw new NotFoundException('주문이 없습니다.');
    if (order.status !== 'PENDING') {
      throw new BadRequestException('취소할 수 없는 주문입니다.');
    }
    await this.prisma.order.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
    return { message: '주문 취소 완료' };
  }
}
