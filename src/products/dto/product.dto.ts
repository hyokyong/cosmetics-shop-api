export class CreateProductDto {
  name!: string;
  description?: string;
  basePrice!: number;
  stock!: number;
  category!: string;
  brandName!: string;
  imageUrl?: string;
}

export class UpdateProductDto {
  name?: string;
  description?: string;
  basePrice?: number;
  stock?: number;
  category?: string;
  brandName?: string;
  imageUrl?: string;
}
