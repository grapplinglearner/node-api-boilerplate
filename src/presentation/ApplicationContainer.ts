import { ProductService, WarehouseService, InventoryTransferService } from '../domain/services';
import { AuthenticationService } from '../domain/services/AuthenticationService';
import { AuthorizationService } from '../domain/services/AuthorizationService';

import { ProductRepository, WarehouseRepository, InventoryTransferRepository, UserRepository } from '../infrastructure/repositories';
import { IUserRepository } from '../domain/repositories/IRepository';
import { AuthMiddleware } from './middleware/authMiddleware';
import { CacheService } from '../infrastructure/cache/CacheService';
import { EmailService } from '../infrastructure/email/EmailService';
import logger from '../infrastructure/logging/logger';

export class ApplicationContainer {
  private productService: ProductService;
  private warehouseService: WarehouseService;
  private transferService: InventoryTransferService;
  private authenticationService: AuthenticationService;
  private authorizationService: AuthorizationService;
  private authMiddleware: AuthMiddleware;
  private userRepository: IUserRepository;
  private cacheService: CacheService;
  private emailService: EmailService;

  constructor() {
    const productRepository = new ProductRepository();
    const warehouseRepository = new WarehouseRepository();
    const inventoryTransferRepository = new InventoryTransferRepository();
    this.userRepository = new UserRepository();

    this.cacheService = new CacheService();
    this.emailService = new EmailService();

    this.productService = new ProductService(productRepository, this.cacheService);
    this.warehouseService = new WarehouseService(warehouseRepository, this.cacheService);
    this.transferService = new InventoryTransferService(
      inventoryTransferRepository,
      productRepository,
      warehouseRepository,
      this.emailService
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

  getCacheService(): CacheService {
    return this.cacheService;
  }

  getEmailService(): EmailService {
    return this.emailService;
  }
}
