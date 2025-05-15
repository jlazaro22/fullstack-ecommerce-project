import { Request, Response, Router } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send('A list of products!');
});

router.get('/:id', (req: Request, res: Response) => {
  res.send(`Product id: ${req.params.id}`);
});

router.post('/', (req: Request, res: Response) => {
  res.send('New product created!');
});

export default router;
