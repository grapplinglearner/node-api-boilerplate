import { Router, Request, Response } from 'express';
import { WarehouseService } from '../../domain/services/WarehouseService';
import { CreateWarehouseUseCase, GetWarehouseUseCase, ListWarehousesUseCase, GetWarehouseCapacityUseCase } from '../../application/usecases/WarehouseUseCases';

export function createWarehouseRoutes(warehouseService: WarehouseService): Router {
  const router = Router();

  const createWarehouseUseCase = new CreateWarehouseUseCase(warehouseService);
  const getWarehouseUseCase = new GetWarehouseUseCase(warehouseService);
  const listWarehousesUseCase = new ListWarehousesUseCase(warehouseService);
  const getCapacityUseCase = new GetWarehouseCapacityUseCase(warehouseService);

  router.post('/', async (req: Request, res: Response) => {
    try {
      const warehouse = await createWarehouseUseCase.execute({
        id: req.body.id,
        name: req.body.name,
        location: req.body.location,
        capacity: req.body.capacity,
      });
      return res.status(201).json(warehouse);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  });

  router.get('/:id', async (req: Request, res: Response) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const warehouse = await getWarehouseUseCase.execute(id);
      return res.json(warehouse);
    } catch (error) {
      return res.status(404).json({ error: (error as Error).message });
    }
  });

  router.get('/:id/capacity', async (req: Request, res: Response) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const capacity = await getCapacityUseCase.execute(id);
      return res.json(capacity);
    } catch (error) {
      return res.status(404).json({ error: (error as Error).message });
    }
  });

  router.get('/', async (_req: Request, res: Response) => {
    try {
      const warehouses = await listWarehousesUseCase.execute();
      return res.json(warehouses);
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  });

  return router;
}
