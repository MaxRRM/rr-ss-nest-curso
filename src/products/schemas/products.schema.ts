import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Supplier } from 'src/suppliers/schemas/supplier.schema';

@Schema()
export class Product extends Document {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  type: string;
  @Prop({ type: [String], ref: 'Supplier', required: false })
  suppliers: [Supplier];
}

export const ProductSchema = SchemaFactory.createForClass(Product);