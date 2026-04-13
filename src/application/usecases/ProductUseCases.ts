import { ProductService } from '../../domain/services/ProductService';
import { Product } from '../../domain/entities/Product';

export class GetProductUseCase {
  constructor(private productService: ProductService) {}

  async execute(productId: string): Promise<Product> {
    return this.productService.getProduct(productId);
  }
}

export class CreateProductUseCase {
  constructor(private productService: ProductService) {}

  async execute(input: {
    id: string;
    name: string;
    sku: string;
    description: string;
    price: number;
    quantity: number;
    warehouseLocation: string;
  }): Promise<Product> {
    return this.productService.createProduct(
      input.id,
      input.name,
      input.sku,
      input.description,
      input.price,
      input.quantity,
      input.warehouseLocation
    );
  }
}

export class ListProductsUseCase {
  constructor(private productService: ProductService) {}

  async execute(): Promise<Product[]> {
    return this.productService.getAllProducts();
  }
}

export class UpdateProductStockUseCase {
  constructor(private productService: ProductService) {}

  async execute(productId: string, quantity: number): Promise<Product> {
    if (quantity > 0) {
      return this.productService.increaseStock(productId, quantity);
    } else {
      return this.productService.decreaseStock(productId, Math.abs(quantity));
    }
  }
}

export class CheckProductStockStatusUseCase {
  constructor(private productService: ProductService) {}

  async execute(productId: string): Promise<string> {
    return this.productService.checkStockStatus(productId);
  }
}

export class GetLowStockProductsUseCase {
  constructor(private productService: ProductService) {}

  async execute(): Promise<Product[]> {
    return this.productService.getLowStockProducts();
  }
}
