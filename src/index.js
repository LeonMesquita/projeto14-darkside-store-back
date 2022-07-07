import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productRouter from './routes/productRouter.js';

dotenv.config();
const app = express();
app.use(cors());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
app.use(express.json());



app.use(productRouter);


app.listen(process.env.PORT, () => {
    console.log("Server running on port " + process.env.PORT);
});