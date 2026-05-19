export class CreateShippingAddressDto {
  address!: string;
  detailAddress?: string;
  zipCode!: string;
  isDefault?: boolean;
}
