import express, { Request, Response } from 'express';

const port = process.env.PORT || 3000;
const app = express();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
