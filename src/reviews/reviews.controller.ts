import { Controller, Get, Post, Body, Query, Req } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  findAll(@Query('productId') productId: string) {
    return this.reviewsService.findAll(+productId);
  }

  @Post()
  create(@Body() dto: CreateReviewDto, @Req() req: any) {
    return this.reviewsService.create(req.user.userId, dto);
  }
}
