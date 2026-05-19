import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, size = 10, category?: string, brandName?: string) {
    const where = {
      isVisible: true,
      ...(category && { category }),
      ...(brandName && { brandName }),
    };

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return { products, total, page, size };
  }

  async findBrands() {
    const brands = await this.prisma.product.findMany({
      where: { isVisible: true },
      select: { brandName: true },
      distinct: ['brandName'],
    });
    return brands.map((b) => b.brandName);
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findFirst({
      where: { id, isVisible: true },
    });
    if (!product) throw new NotFoundException('상품이 없습니다.');
    return product;
  }

  async create(dto: CreateProductDto) {
    return this.prisma.product.create({ data: dto });
  }

  async update(id: number, dto: UpdateProductDto) {
    return this.prisma.product.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.prisma.product.update({
      where: { id },
      data: { isVisible: false },
    });
    return { message: '삭제 완료' };
  }
}
