import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import db from 'src/db';
import { createUserSchema, loginSchema, usersTable } from 'src/db/usersSchema';
import { validateData } from 'src/middlewares/validationMiddleware';

const router = Router();

router.post(
  '/register',
  validateData(createUserSchema),
  async (req: Request, res: Response) => {
    try {
      const data = req.cleanBody;
      data.password = await bcrypt.hash(data.password, 10);

      const [user] = await db.insert(usersTable).values(data).returning();
      const userResponse = { ...user, password: undefined };

      res.status(201).json(userResponse);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Failed to create user' });
    }
  },
);

router.post(
  '/login',
  validateData(loginSchema),
  async (req: Request, res: Response) => {
    try {
      const { email, password } = req.cleanBody;

      const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email));

      if (!user) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }

      const userResponse = { ...user, password: undefined };

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET!,
        {
          expiresIn: '12h',
        },
      );

      res.status(200).json({ user: userResponse, token });
    } catch (error) {}
  },
);

export default router;
