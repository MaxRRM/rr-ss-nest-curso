import { IsString, IsNotEmpty } from 'class-validator';

export class AddSupplierDto {
  @IsString()
  @IsNotEmpty()
  readonly supplierId: string;
}
