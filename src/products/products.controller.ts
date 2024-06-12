import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './schemas/products.schema';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { AddSupplierDto } from './dto/add-supplier.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Product[]> {
    return await this.productsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Product | null> {
    return this.productsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('add-supplier/:id')
  addSupplier(@Param('id') id: string, @Body() addSupplierDto: AddSupplierDto) {
    return this.productsService.addSupplier(id, addSupplierDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('remove-product/:id')
  removeSupplier(@Param('id') id: string, @Body() addProductDto: AddSupplierDto) {
    return this.productsService.removeSupplier(id, addProductDto);
  }


  @UseGuards(JwtAuthGuard)
  @Get('type/:type')
  findByType(@Param('type') type: string): Promise<Product[]> {
    return this.productsService.findByType(type);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateProductDto): Promise<Product | null> {
    return this.productsService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {

    return this.productsService.remove(id);
  }
}
