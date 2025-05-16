import { eq } from 'drizzle-orm';
import { Request, Response } from 'express';
import db from '../../db';
import { productsTable } from '../../db/productsSchema';

export async function listProducts(req: Request, res: Response) {
  try {
    const products = await db.select().from(productsTable);

    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to get products' });
  }
}

export async function getProductById(req: Request, res: Response) {
  const id = Number(req.params.id);

  try {
    const [product] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, id));

    if (!product) {
      return res.status(404).json({ message: `Product not found. Id: ${id}` });
    }

    res.status(200).json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Failed to find product with id: ${id}` });
  }
}

export async function createProduct(req: Request, res: Response) {
  try {
    const [product] = await db
      .insert(productsTable)
      .values(req.body)
      .returning();

    res.status(201).json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to create product' });
  }
}

export async function updateProduct(req: Request, res: Response) {
  const id = Number(req.params.id);
  const fieldsValues = req.body;

  const [product] = await db
    .update(productsTable)
    .set(fieldsValues)
    .where(eq(productsTable.id, id))
    .returning();

  if (!product) {
    return res.status(404).json({ message: `No product found with id: ${id}` });
  }

  res.status(202).json(product);
}

export async function deleteProduct(req: Request, res: Response) {
  const id = Number(req.params.id);

  try {
    const [deletedProduct] = await db
      .delete(productsTable)
      .where(eq(productsTable.id, id))
      .returning();

    if (!deletedProduct) {
      return res
        .status(404)
        .json({ message: `No product found with id: ${id}` });
    }

    res
      .status(202)
      .json({ message: `Product deleted with id: ${deletedProduct.id}` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to delete product' });
  }
}
