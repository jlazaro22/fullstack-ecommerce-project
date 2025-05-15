import { Request, Response } from 'express';

export function listProducts(req: Request, res: Response) {
  res.send('A list of products!');
}

export function getProductById(req: Request, res: Response) {
  res.send(`Product id: ${req.params.id}`);
}

export function createProduct(req: Request, res: Response) {
  res.send('New product created!');
}

export function updateProduct(req: Request, res: Response) {
  res.send(`Product updated with id: ${req.params.id}`);
}

export function deleteProduct(req: Request, res: Response) {
  res.send(`Product deleted with id: ${req.params.id}`);
}
