import { Schema, model, Document } from 'mongoose';

export interface IProductDocument extends Document {
  name: string;
  sku: string;
  description: string;
  price: number;
  quantity: number;
  warehouseLocation: string;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProductDocument>(
  {
    name: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    description: { type: String },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0 },
    warehouseLocation: { type: String, required: true },
  },
  { timestamps: true }
);

export const ProductModel = model<IProductDocument>('Product', productSchema);

export interface IWarehouseDocument extends Document {
  name: string;
  location: string;
  capacity: number;
  currentUsage: number;
  createdAt: Date;
  updatedAt: Date;
}

const warehouseSchema = new Schema<IWarehouseDocument>(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    capacity: { type: Number, required: true, min: 1 },
    currentUsage: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

export const WarehouseModel = model<IWarehouseDocument>('Warehouse', warehouseSchema);

export interface IInventoryTransferDocument extends Document {
  productId: string;
  fromWarehouseId: string;
  toWarehouseId: string;
  quantity: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const inventoryTransferSchema = new Schema<IInventoryTransferDocument>(
  {
    productId: { type: String, required: true },
    fromWarehouseId: { type: String, required: true },
    toWarehouseId: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: ['PENDING', 'IN_TRANSIT', 'COMPLETED', 'FAILED'],
      default: 'PENDING',
    },
  },
  { timestamps: true }
);

export const InventoryTransferModel = model<IInventoryTransferDocument>(
  'InventoryTransfer',
  inventoryTransferSchema
);

export interface IUserDocument extends Document {
  email: string;
  passwordHash: string;
  name: string;
  role: 'admin' | 'warehouse_manager' | 'staff';
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUserDocument>(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'warehouse_manager', 'staff'],
      default: 'staff',
    },
  },
  { timestamps: true }
);

export const UserModel = model<IUserDocument>('User', userSchema);
