import { Module, forwardRef } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { SuppliersController } from './suppliers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Supplier, SupplierSchema } from './schemas/supplier.schema';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [
    //Para referencias circulares
    forwardRef(() => ProductsModule),
    MongooseModule.forFeature([{ name: Supplier.name, schema: SupplierSchema }])
  ],
  controllers: [SuppliersController],
  providers: [SuppliersService],
  exports: [SuppliersService]
})
export class SuppliersModule { }
