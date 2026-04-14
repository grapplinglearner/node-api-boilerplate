import { Product } from '../entities/Product';
import { IProductRepository } from '../repositories/IRepository';
import { CacheService } from '../../infrastructure/cache/CacheService';
import { getPaginationOptions, createPaginatedResponse, PaginatedResponse } from '../../presentation/utils/pagination';
import { Request } from 'express';
import { config } from '../../infrastructure/config/config';

export class ProductService {
  constructor(
    private productRepository: IProductRepository,
    private cacheService?: CacheService
  ) {}

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

    const savedProduct = await this.productRepository.save(product);

    if (this.cacheService) {
      await this.cacheService.clear('products:*');
    }

    return savedProduct;
  }

  async getProduct(id: string): Promise<Product> {
    const cacheKey = `products:${id}`;

    if (this.cacheService) {
      const cached = await this.cacheService.get<Product>(cacheKey);
      if (cached) {
        return cached;
      }
    }

    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error(`Product with ID ${id} not found`);
    }

    if (this.cacheService) {
      await this.cacheService.set(cacheKey, product, config.CACHE_TTL_PRODUCTS);
    }

    return product;
  }

  async getAllProducts(req?: Request): Promise<Product[] | PaginatedResponse<Product>> {
    if (req) {
      const options = getPaginationOptions(req);
      const [products, total] = await Promise.all([
        this.productRepository.findAllPaginated(options.skip, options.limit),
        this.productRepository.count(),
      ]);

      return createPaginatedResponse(products, total, options);
    }

    return this.productRepository.findAll();
  }

  async updateProduct(
    id: string,
    name: string,
    sku: string,
    description: string,
    price: number,
    quantity: number,
    warehouseLocation: string
  ): Promise<Product> {
    const product = await this.getProduct(id);

    if (sku !== product.sku) {
      const existingProduct = await this.productRepository.findBySku(sku);
      if (existingProduct) {
        throw new Error(`Product with SKU ${sku} already exists`);
      }
    }

    product.name = name;
    product.sku = sku;
    product.description = description;
    if (price < 0) {
      throw new Error('Price cannot be negative');
    }
    product.price = price;
    product.quantity = quantity;
    product.warehouseLocation = warehouseLocation;
    product.updatedAt = new Date();

    const updatedProduct = await this.productRepository.update(product);

    if (this.cacheService) {
      await this.cacheService.delete(`products:${id}`);
      await this.cacheService.clear('products:*');
    }

    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<void> {
    await this.getProduct(id);
    await this.productRepository.softDelete(id);

    if (this.cacheService) {
      await this.cacheService.delete(`products:${id}`);
      await this.cacheService.clear('products:*');
    }
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
