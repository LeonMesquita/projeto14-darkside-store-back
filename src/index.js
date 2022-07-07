import express from 'express';
import dotenv from 'dotenv';
import productRouter from './routes/productRouter.js';
import cors from 'cors';
dotenv.config();
const app = express();


//Cors Configuration - Start
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested, Content-Type, Accept Authorization"
    )
    if (req.method === "OPTIONS") {
      res.header(
        "Access-Control-Allow-Methods",
        "POST, PUT, PATCH, GET, DELETE"
      )
      return res.status(200).json({})
    }
    next()
  })
/*
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
*/
app.use(cors());
app.use(express.json());



app.use(productRouter);


app.listen(process.env.PORT, () => {
    console.log("Server running on port " + process.env.PORT);
});