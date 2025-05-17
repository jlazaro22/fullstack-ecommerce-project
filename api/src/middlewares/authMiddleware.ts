import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!);

    if (typeof decodedToken !== 'object' || !decodedToken.userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    req.userId = decodedToken.userId;
    req.role = decodedToken.role;

    next();
  } catch (error) {
    res.status(401).json({ message: 'Access denied' });
  }
}

export function verifySeller(req: Request, res: Response, next: NextFunction) {
  const role = req.role;

  if (role !== 'seller') {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  next();
}
