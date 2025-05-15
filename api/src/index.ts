import express, { json, Request, Response, urlencoded } from 'express';
import productsRoutes from './routes/products';

const port = process.env.PORT || 3000;
const app = express();

app.use(urlencoded({ extended: false }));
app.use(json());

app.get('/healthcheck', (req: Request, res: Response) => {
  res.send('API responding!');
});

app.use('/products', productsRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
