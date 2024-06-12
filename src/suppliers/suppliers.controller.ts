import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { Supplier } from './schemas/supplier.schema';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { AddProductDto } from './dto/add-product.dto';
import { RemoveProductDto } from './dto/remove-product.dto';

@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createSupplierDto: CreateSupplierDto) {
    return this.suppliersService.create(createSupplierDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Supplier[]> {
    return await this.suppliersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Patch('add-product/:id')
  addProduct(@Param('id') id: string, @Body() addProductDto: AddProductDto) {
    return this.suppliersService.addProduct(id, addProductDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('remove-product/:id')
  removeProduct(@Param('id') id: string, @Body() removeProductDto: RemoveProductDto) {
    return this.suppliersService.removeProduct(id, removeProductDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Supplier | null> {
    return this.suppliersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('type/:type')
  findByType(@Param('type') type: string): Promise<Supplier[]> {
    return this.suppliersService.findByType(type);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateSupplierDto): Promise<Supplier | null> {
    return this.suppliersService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.suppliersService.remove(id);
  }
}
