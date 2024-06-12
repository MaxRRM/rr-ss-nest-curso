import { IsString, IsNotEmpty } from 'class-validator';

export class AddProductDto {
  @IsString()
  @IsNotEmpty()
  readonly productId: string;
}
