import { Product } from '../entities/Product';
import { IProductRepository } from '../repositories/IRepository';

export class ProductService {
  constructor(private productRepository: IProductRepository) {}

  async createProduct(
    id: string,
    name: string,
    sku: string,
    description: string,
    price: number,
    quantity: number,
    warehouseLocation: string
  ): Promise<Product> {
    const existingProduct = await this.productRepository.findBySku(sku);
    if (existingProduct) {
      throw new Error(`Product with SKU ${sku} already exists`);
    }

    const product = new Product(
      id,
      name,
      sku,
      description,
      price,
      quantity,
      warehouseLocation,
      new Date(),
      new Date()
    );

    return this.productRepository.save(product);
  }

  async getProduct(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error(`Product with ID ${id} not found`);
    }
    return product;
  }

  async getAllProducts(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const product = await this.getProduct(id);

    if (updates.name) product.name = updates.name;
    if (updates.description) product.description = updates.description;
    if (updates.price !== undefined) {
      if (updates.price < 0) {
        throw new Error('Price cannot be negative');
      }
      product.price = updates.price;
    }
    if (updates.warehouseLocation) product.warehouseLocation = updates.warehouseLocation;

    product.updatedAt = new Date();
    return this.productRepository.update(product);
  }

  async deleteProduct(id: string): Promise<void> {
    await this.getProduct(id);
    return this.productRepository.delete(id);
  }

  async increaseStock(id: string, quantity: number): Promise<Product> {
    const product = await this.getProduct(id);
    product.updateStock(quantity);
    return this.productRepository.update(product);
  }

  async decreaseStock(id: string, quantity: number): Promise<Product> {
    const product = await this.getProduct(id);
    product.updateStock(-quantity);
    return this.productRepository.update(product);
  }

  async getProductsByWarehouse(warehouseId: string): Promise<Product[]> {
    return this.productRepository.findByWarehouse(warehouseId);
  }

  async checkStockStatus(id: string): Promise<string> {
    const product = await this.getProduct(id);
    return product.getStockStatus();
  }

  async getOutOfStockProducts(): Promise<Product[]> {
    const allProducts = await this.productRepository.findAll();
    return allProducts.filter(p => p.getStockStatus() === 'OUT_OF_STOCK');
  }

  async getLowStockProducts(): Promise<Product[]> {
    const allProducts = await this.productRepository.findAll();
    return allProducts.filter(p => p.getStockStatus() === 'LOW_STOCK');
  }
}
