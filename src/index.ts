import dotenv from 'dotenv';
dotenv.config();
import express, {  Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import helmet from 'helmet';
import errorHnadler from './middleWares/error-handler';
import routes from './routes';
import bodyParser from 'body-parser';
import passport from 'passport';
import limiter from './config/limiterConfig';
import './config/passportConfig';
import cookieParser from 'cookie-parser';
const JwtStrategy = require('passport-jwt').Strategy;
import './middleWares/passportAuth.middleware';

const app = express();
const prisma = new PrismaClient();

passport.use(JwtStrategy);
app.use(passport.initialize());
app.use('/api',routes);
app.use(bodyParser.json())
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(cookieParser());
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

/// Need to check beheiver ///////////////////////////////////////////////////////////////////////////////////////////////
app.get("/signup",passport.authenticate('jwt',{session:false}),(req,res)=>{
  res.render('signup');
})


app.get("/signin",(req,res)=>{
  res.render('signin');
})


app.get("/addproduct",(req,res)=>{
  res.render("addProduct.ejs");
})

app.get('/auth',passport.authenticate('jwt',{session:false}),(req,res)=>{
  res.send("fffffffffffff");
});

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


const port = process.env.port;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

