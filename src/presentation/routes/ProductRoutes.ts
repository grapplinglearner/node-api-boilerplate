import { Router, Request, Response } from 'express';
import { ProductService } from '../../domain/services/ProductService';
import { CreateProductUseCase, GetProductUseCase, ListProductsUseCase } from '../../application/usecases/ProductUseCases';

export function createProductRoutes(productService: ProductService): Router {
  const router = Router();

  const createProductUseCase = new CreateProductUseCase(productService);
  const getProductUseCase = new GetProductUseCase(productService);
  const listProductsUseCase = new ListProductsUseCase(productService);

  router.post('/', async (req: Request, res: Response) => {
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

  router.get('/:id', async (req: Request, res: Response) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const product = await getProductUseCase.execute(id);
      return res.json(product);
    } catch (error) {
      return res.status(404).json({ error: (error as Error).message });
    }
  });

  router.get('/', async (_req: Request, res: Response) => {
    try {
      const products = await listProductsUseCase.execute();
      return res.json(products);
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  });

  return router;
}
