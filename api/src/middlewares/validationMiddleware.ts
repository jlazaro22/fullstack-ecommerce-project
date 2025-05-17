import { NextFunction, Request, Response } from 'express';
import _ from 'lodash';
import { z, ZodError } from 'zod';

export function validateData(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      req.cleanBody = _.pick(req.body, Object.keys(schema.shape));
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          message: `Field: ${issue.path.join('.')}. Error: ${issue.message}`,
        }));

        res.status(400).json({ error: 'Invalid data', details: errorMessages });
      }

      res.status(500).json({ error: 'Internal server error: ' + error });
    }
  };
}
