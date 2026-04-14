import { Router, Request, Response } from 'express';
import { ProductService } from '../../domain/services/ProductService';
import { CreateProductUseCase, GetProductUseCase, ListProductsUseCase, UpdateProductUseCase, DeleteProductUseCase } from '../../application/usecases/ProductUseCases';
import { AuthMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware';
import { Permission } from '../../domain/types/auth';
import { validate, productSchemas } from '../middleware/validation/schemas';

export function createProductRoutes(productService: ProductService, authMiddleware: AuthMiddleware): Router {
  const router = Router();

  const createProductUseCase = new CreateProductUseCase(productService);
  const getProductUseCase = new GetProductUseCase(productService);
  const listProductsUseCase = new ListProductsUseCase(productService);
  const updateProductUseCase = new UpdateProductUseCase(productService);
  const deleteProductUseCase = new DeleteProductUseCase(productService);

  router.post('/', authMiddleware.requirePermission(Permission.CREATE_PRODUCTS), validate(productSchemas.create), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const product = await createProductUseCase.execute({
        id: req.body.id,
        name: req.body.name,
        sku: req.body.sku,
        description: req.body.description,
        price: req.body.price,
        quantity: req.body.quantity,
        warehouseLocation: req.body.warehouseLocation,
      });
      return res.status(201).json(product);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  });

  router.get('/:id', authMiddleware.requirePermission(Permission.READ_PRODUCTS), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const product = await getProductUseCase.execute(id);
      return res.json(product);
    } catch (error) {
      return res.status(404).json({ error: (error as Error).message });
    }
  });

  router.get('/', authMiddleware.requirePermission(Permission.READ_PRODUCTS), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const products = await listProductsUseCase.execute(req);
      return res.json(products);
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  });

  router.put('/:id', authMiddleware.requirePermission(Permission.UPDATE_PRODUCTS), validate(productSchemas.update), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const product = await updateProductUseCase.execute(id, {
        name: req.body.name,
        sku: req.body.sku,
        description: req.body.description,
        price: req.body.price,
        quantity: req.body.quantity,
        warehouseLocation: req.body.warehouseLocation,
      });
      return res.json(product);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  });

  router.delete('/:id', authMiddleware.requirePermission(Permission.DELETE_PRODUCTS), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      await deleteProductUseCase.execute(id);
      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  });

  return router;
}
