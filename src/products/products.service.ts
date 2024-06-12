import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schemas/products.schema';
import { Model } from 'mongoose';
import { ProductAlreadyExistException } from 'src/common/exceptions/producst-already-exists';
import { AddSupplierDto } from './dto/add-supplier.dto';
import { SupplierAlreadyExistException } from 'src/common/exceptions/supplier-already-exists';
import { InvalidIdException } from 'src/common/exceptions/invalid-id';
import { SuppliersService } from 'src/suppliers/suppliers.service';

@Injectable()
export class ProductsService {

  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @Inject(forwardRef(() => SuppliersService)) private readonly suppliersService: SuppliersService,
  ) { }

  async create(createProductDto: CreateProductDto) {
    const productExists = await this.productModel.findOne({ name: createProductDto.name }).exec();
    if (productExists) throw new ProductAlreadyExistException();
    const newProduct = new this.productModel({
      name: createProductDto.name,
      type: createProductDto.type
    });
    return await newProduct.save();
  }

  async findAll(): Promise<Product[]> {
    const products = await this.productModel.find().exec();
    return products;
  }

  async findOne(id: string): Promise<Product | null> {
    const product = await this.productModel.findById(id).exec();
    return product ? product.toObject() : null;
  }

  async addSupplier(id: string, addSupplierDto: AddSupplierDto, bubble: boolean = false): Promise<Product | null> {
    const { supplierId } = addSupplierDto;
    let product = null;
    try {
      // Se busca el producto con la condición que tenga el id del supplier en su colección
      product = await this.productModel.findOne({
        _id: id,
        suppliers: supplierId
      }).exec();
    } catch (err) { throw new InvalidIdException() }

    /* Si el producto es encontrado:
    *   1) Se lanza un error si llamada directa
    *   2) Se retorna null si es llamada a consecuencia del servicio de supplier
    */
    if (product) {
      if (!bubble) throw new SupplierAlreadyExistException()
      return null
    }

    // Se agrega el supplier al producto
    const resultUpdate = await this.productModel.findByIdAndUpdate(
      { _id: id },
      { $push: { suppliers: supplierId } },
      { new: true }
    ).exec();

    // Se agrega a su vez el producto al supplier
    await this.suppliersService.addProduct(supplierId, { productId: id }, true);

    return resultUpdate;
  }

  async removeSupplier(id: string, addProductDto: AddSupplierDto): Promise<Product> {
    const { supplierId } = addProductDto;

    // Se remueve el supplier del producto
    return await this.productModel.findByIdAndUpdate(
      { _id: id },
      { $pull: { products: supplierId } },
      { new: true }
    ).exec();
  }

  async removeSupplierFromAllProduct(supplierId: string) {
    await this.productModel.updateMany(
      { suppliers: supplierId },
      { $pull: { suppliers: supplierId } }
    ).exec();
  }

  async findByType(type: string): Promise<Product[]> {
    const suppliers = await this.productModel.find({ type: type }).exec();
    return suppliers;
  }

  async update(id: string, updateUserDto: UpdateProductDto): Promise<Product | null> {
    const updateUser = await this.productModel.findByIdAndUpdate(
      id,
      { ...updateUserDto },
      { new: true }
    ).exec();

    return updateUser ? updateUser.toObject() : null;
  }

  async remove(id: string): Promise<void> {
    //Se elimina el producto y todas las referencias en los suppliers
    await this.productModel.findByIdAndDelete(id).exec();
    await this.suppliersService.removeProductFromAllSuppliers(id);
  }
}
