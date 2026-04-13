import { ProductService, WarehouseService, InventoryTransferService } from '../domain/services';
import { AuthenticationService } from '../domain/services/AuthenticationService';
import { AuthorizationService } from '../domain/services/AuthorizationService';

import { ProductRepository, WarehouseRepository, InventoryTransferRepository, UserRepository } from '../infrastructure/repositories';
import { IUserRepository } from '../domain/repositories/IRepository';
import { AuthMiddleware } from './middleware/authMiddleware';

export class ApplicationContainer {
  private productService: ProductService;
  private warehouseService: WarehouseService;
  private transferService: InventoryTransferService;
  private authenticationService: AuthenticationService;
  private authorizationService: AuthorizationService;
  private authMiddleware: AuthMiddleware;
  private userRepository: IUserRepository;

  constructor() {
    const productRepository = new ProductRepository();
    const warehouseRepository = new WarehouseRepository();
    const inventoryTransferRepository = new InventoryTransferRepository();
    this.userRepository = new UserRepository();

    this.productService = new ProductService(productRepository);
    this.warehouseService = new WarehouseService(warehouseRepository);
    this.transferService = new InventoryTransferService(
      inventoryTransferRepository,
      productRepository,
      warehouseRepository
    );
    this.authenticationService = new AuthenticationService(this.userRepository);
    this.authorizationService = new AuthorizationService();
    this.authMiddleware = new AuthMiddleware(this.authenticationService, this.authorizationService);
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

  getAuthenticationService(): AuthenticationService {
    return this.authenticationService;
  }

  getAuthorizationService(): AuthorizationService {
    return this.authorizationService;
  }

  getAuthMiddleware(): AuthMiddleware {
    return this.authMiddleware;
  }

  getUserRepository(): IUserRepository {
    return this.userRepository;
  }
}
