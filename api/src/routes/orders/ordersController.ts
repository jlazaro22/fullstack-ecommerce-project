import { Request, Response } from 'express';
import db from 'src/db/index.js';
import { orderItemsTable, ordersTable } from 'src/db/ordersSchema.js';

export async function createOrder(req: Request, res: Response) {
  try {
    const { items } = req.cleanBody;
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const [newOrder] = await db
      .insert(ordersTable)
      .values({ userId: userId as number })
      .returning();

    // TODO: validate products ids and take their current price from db
    const orderItems = items.map((item: any) => ({
      ...item,
      orderId: newOrder.id,
    }));

    const newOrderItems = await db
      .insert(orderItemsTable)
      .values(orderItems)
      .returning();

    res.status(201).json({ ...newOrder, items: newOrderItems });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to create order' });
  }
}
