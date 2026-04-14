import { Product } from '../../domain/entities/Product';
import { IProductRepository } from '../../domain/repositories/IRepository';
import { ProductModel, IProductDocument } from '../database/schemas/schemas';

export class ProductRepository implements IProductRepository {
  private mapToEntity(doc: IProductDocument): Product {
    return new Product(
      doc._id.toString(),
      doc.name,
      doc.sku,
      doc.description,
      doc.price,
      doc.quantity,
      doc.warehouseLocation,
      doc.createdAt,
      doc.updatedAt
    );
  }

  async findById(id: string): Promise<Product | null> {
    const doc = await ProductModel.findById(id);
    return doc ? this.mapToEntity(doc) : null;
  }

  async findBySku(sku: string): Promise<Product | null> {
    const doc = await ProductModel.findOne({ sku });
    return doc ? this.mapToEntity(doc) : null;
  }

  async findAll(): Promise<Product[]> {
    const docs = await ProductModel.find({ deletedAt: null });
    return docs.map(doc => this.mapToEntity(doc));
  }

  async findAllPaginated(skip: number, limit: number): Promise<Product[]> {
    const docs = await ProductModel.find({ deletedAt: null })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    return docs.map(doc => this.mapToEntity(doc));
  }

  async count(): Promise<number> {
    return ProductModel.countDocuments({ deletedAt: null });
  }

  async save(product: Product): Promise<Product> {
    const docData: any = {
      name: product.name,
      sku: product.sku,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      warehouseLocation: product.warehouseLocation,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };

    if (product.id && product.id.trim() !== '') {
      docData._id = product.id;
    }

    const doc = await ProductModel.create(docData);
    return this.mapToEntity(doc);
  }

  async update(product: Product): Promise<Product> {
    const doc = await ProductModel.findByIdAndUpdate(
      product.id,
      {
        name: product.name,
        sku: product.sku,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        warehouseLocation: product.warehouseLocation,
        updatedAt: product.updatedAt,
      },
      { new: true }
    );

    if (!doc) {
      throw new Error(`Product with ID ${product.id} not found`);
    }

    return this.mapToEntity(doc);
  }

  async delete(id: string): Promise<void> {
    await ProductModel.findByIdAndDelete(id);
  }

  async softDelete(id: string): Promise<void> {
    await ProductModel.findByIdAndUpdate(id, { deletedAt: new Date() });
  }

  async findByWarehouse(warehouseId: string): Promise<Product[]> {
    const docs = await ProductModel.find({ warehouseLocation: warehouseId, deletedAt: null });
    return docs.map(doc => this.mapToEntity(doc));
  }
}
