import express from 'express';
import dotenv from 'dotenv';
import productRouter from './routes/productRouter.js';
import authRouter from './routes/authRoutes.js'; 
import cors from 'cors';
dotenv.config();
const app = express();


app.use(cors());
app.use(express.json());



app.use(productRouter);
app.use(authRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});