import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Product } from 'src/products/schemas/products.schema';

@Schema()
export class Supplier extends Document {
  @Prop({ required: true, unique: true })
  name: string;
  @Prop({ required: true })
  type: string;
  @Prop({ required: true })
  address: string;
  // @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Product', required: false })
  @Prop({ type: [String], ref: 'Product', required: false })
  products: [Product];
}

export const SupplierSchema = SchemaFactory.createForClass(Supplier);