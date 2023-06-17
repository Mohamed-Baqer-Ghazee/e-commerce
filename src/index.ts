import express, { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import jwt from 'jsonwebtoken'
import helmet from 'helmet'
import  rateLimit from 'express-rate-limit'
import errorHnadler from './middleWares/error-handler';
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import routes from './routes'
import bodyParser from 'body-parser'
const port = process.env.port;
const secretKey = process.env.TOKEN_SECRET;

const app = express();
const prisma = new PrismaClient();
dotenv.config();

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

const hashPassword = (password: string)=> {
  const salt = parseInt(process.env.SALT as string,10);
  return bcrypt.hashSync(`${password}${process.env.BCRYPT_PASSWORD}`,salt)
}

app.use('/api',routes);
app.use(bodyParser.json())
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(helmet());
app.use(limiter);
app.use(errorHnadler);

app.get('/', async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany();
    res.render('home', { products });
  } catch (error) {
    throw new Error(`Unable to load products: ${(error as Error).message}`)
  }
});

app.get("/signup",(req,res)=>{
  res.render('signup');
})


app.get("/signin",(req,res)=>{
  res.render('signin');
})


app.get("/addproduct",(req,res)=>{
  res.render("addProduct.ejs");
})

// Add a new product
app.post('/addproduct', async (req, res) => {
  try {
    const { name, price,imageUrl } = req.body;
    console.log(req.body);
    
    
    const product = await prisma.product.create({
      data: {
        userId: "2",
        name,
        price:parseFloat(price),
        imageUrl,
      },
    });
    res.redirect('/');
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get product by ID
app.get('/products/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const product = await prisma.product.findUnique({ where: { id: id } });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.render('product', { product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a product by ID
app.post('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Perform the deletion logic here
    await prisma.product.delete({
      where: {
        id: id,
      },
    });

    // Redirect the user to the home page with a success query parameter
    res.redirect('/?alert=success');
  } catch (error) {
    // Handle any errors
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// app.post("/addtocart/:id",(req,res)=>{
//   const {id, name}= req.body;
//   const product = await prisma.cart.update({
//     data:{

//     }
//   })
// })

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err: any, req: Request, res: Response) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

