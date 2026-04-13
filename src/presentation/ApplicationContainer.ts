import { ProductService, WarehouseService, InventoryTransferService } from '../domain/services';

import { ProductRepository, WarehouseRepository, InventoryTransferRepository } from '../infrastructure/repositories';

export class ApplicationContainer {
  private productService: ProductService;
  private warehouseService: WarehouseService;
  private transferService: InventoryTransferService;

  constructor() {
    const productRepository = new ProductRepository();
    const warehouseRepository = new WarehouseRepository();
    const inventoryTransferRepository = new InventoryTransferRepository();

    this.productService = new ProductService(productRepository);
    this.warehouseService = new WarehouseService(warehouseRepository);
    this.transferService = new InventoryTransferService(
      inventoryTransferRepository,
      productRepository,
      warehouseRepository
    );
  }

  getProductService(): ProductService {
    return this.productService;
  }

  getWarehouseService(): WarehouseService {
    return this.warehouseService;
  }

  getTransferService(): InventoryTransferService {
    return this.transferService;
  }
}
