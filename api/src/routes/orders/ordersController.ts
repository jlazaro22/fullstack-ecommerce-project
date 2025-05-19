import { eq } from 'drizzle-orm';
import { Request, Response } from 'express';
import db from 'src/db/index.js';
import { orderItemsTable, ordersTable } from 'src/db/ordersSchema.js';

// TODO: if req.role is admin return all orders, if req.role is seller, return orders by sellerId, else return only orders filtered by userId
export async function listOrders(req: Request, res: Response) {
  try {
    const userId = Number(req.userId);

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const orders = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.userId, userId));

    res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to get orders' });
  }
}

export async function getOrderById(req: Request, res: Response) {
  const id = Number(req.params.id);

  try {
    // TODO: only works if a relationship is defined
    // const result = await db.query.ordersTable.findFirst({
    //   where: eq(ordersTable.id, id),
    //   with: {
    //     items: true,
    //   },
    // });

    const orderWithItems = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.id, id))
      .leftJoin(orderItemsTable, eq(ordersTable.id, orderItemsTable.orderId));

    if (orderWithItems.length === 0) {
      res.status(404).json({ message: `Order not found. Id: ${id}` });
      return;
    }

    const mergedOrder = {
      ...orderWithItems[0].orders,
      items: orderWithItems.map((oi) => oi.order_items),
    };

    res.status(200).json(mergedOrder);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Failed to find order with id: ${id}` });
  }
}

export async function createOrder(req: Request, res: Response) {
  try {
    const { items } = req.cleanBody;
    const userId = Number(req.userId);

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const [newOrder] = await db
      .insert(ordersTable)
      .values({ userId })
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

export async function updateOrder(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);

    const [updatedOrder] = await db
      .update(ordersTable)
      .set(req.body)
      .where(eq(ordersTable.id, id))
      .returning();

    if (!updatedOrder) {
      res.status(404).json({ message: `No order found with id: ${id}` });
      return;
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to update order' });
  }
}
