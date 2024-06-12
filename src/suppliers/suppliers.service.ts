import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Supplier } from './schemas/supplier.schema';
import { Model } from 'mongoose';
import { SupplierAlreadyExistException } from 'src/common/exceptions/supplier-already-exists';
import { AddProductDto } from './dto/add-product.dto';
import { ProductAlreadyExistException } from 'src/common/exceptions/producst-already-exists';
import { InvalidIdException } from 'src/common/exceptions/invalid-id';
import { RemoveProductDto } from './dto/remove-product.dto';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class SuppliersService {

  constructor(
    @InjectModel(Supplier.name) private readonly supplierModel: Model<Supplier>,
    @Inject(forwardRef(() => ProductsService)) private readonly productsService: ProductsService,
  ) { }

  async create(createSupplierDto: CreateSupplierDto) {
    const supplierExists = await this.supplierModel.findOne({ name: createSupplierDto.name }).exec();
    if (supplierExists) throw new SupplierAlreadyExistException();
    const newSupplier = new this.supplierModel({
      name: createSupplierDto.name,
      type: createSupplierDto.type,
      address: createSupplierDto.address
    });
    return await newSupplier.save();
  }

  async findAll(): Promise<Supplier[]> {
    const suppliers = await this.supplierModel.find().exec();
    return suppliers;
  }

  async addProduct(id: string, addProductDto: AddProductDto, bubble: boolean = false): Promise<Supplier | null> {
    const { productId } = addProductDto;
    let supplier = null;
    try {
      // Se busca el supplier con la condición que tenga el id del producto en su colección
      supplier = await this.supplierModel.findOne({
        _id: id,
        products: productId
      }).exec();
    } catch (err) { throw new InvalidIdException() }

    /* Si el supplier es encontrado:
    *   1) Se lanza un error si llamada directa
    *   2) Se retorna null si es llamada a consecuencia del servicio de product
    */
    if (supplier) {
      if (!bubble) throw new ProductAlreadyExistException();
      return null
    }

    // Se agrega el producto al supplier
    const resultUpdate = await this.supplierModel.findByIdAndUpdate(
      { _id: id },
      { $push: { products: productId } },
      { new: true }
    ).exec()

    // Se agrega a su vez el supplier al producto
    await this.productsService.addSupplier(productId, { supplierId: id }, true);

    return resultUpdate;
  }

  async removeProduct(id: string, removeProductDto: RemoveProductDto): Promise<Supplier> {
    const { productId } = removeProductDto;

    // Se remueve el producto del supplier
    return await this.supplierModel.findByIdAndUpdate(
      { _id: id },
      { $pull: { products: productId } },
      { new: true }
    ).exec()
  }

  async removeProductFromAllSuppliers(productId: string) {
    await this.supplierModel.updateMany(
      { products: productId },
      { $pull: { products: productId } }
    ).exec();
  }

  async findOne(id: string): Promise<Supplier | null> {
    const supplier = await this.supplierModel.findById(id).exec();
    return supplier ? supplier.toObject() : null;
  }

  async findByType(type: string): Promise<Supplier[]> {
    const suppliers = await this.supplierModel.find({ type: type }).exec();
    return suppliers;
  }

  async update(id: string, updateUserDto: UpdateSupplierDto): Promise<Supplier | null> {
    const updateUser = await this.supplierModel.findByIdAndUpdate(
      id,
      { ...updateUserDto },
      { new: true }
    ).exec();

    return updateUser ? updateUser.toObject() : null;
  }

  async remove(id: string): Promise<void> {
    //Se elimina el supplier y todas las referencias en los productos
    await this.supplierModel.findByIdAndDelete(id).exec();
    await this.productsService.removeSupplierFromAllProduct(id);
  }
}
