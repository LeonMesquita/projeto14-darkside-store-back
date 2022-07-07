import dotenv from 'dotenv';
dotenv.config();
import {db, objectId} from '../db/mongo.js'


export async function createProduct(req, res){
    const productBody = req.body;
    if (!productBody) return res.sendStatus(400);
    try{
        await db.collection('products').insertOne(
            productBody
        );
        return res.sendStatus(201);
    }catch(error){
        console.log(error)
        return res.status(400).send("Não foi possível criar produto");
    }
}

export async function getProducts(req, res){
    const productType = req.params.productType;
    try{
        if(productType === 'Tudo' || !productType){
            const productsList = await db.collection('products').find().toArray();
            return res.status(200).send(productsList);            
        }
        else{
            const productsList = await db.collection('products').find({type: productType}).toArray();
            if(productsList.length===0 || !productsList) return res.sendStatus(404);
            return res.status(200).send(productsList);    
        }

    }catch(error){

    }
}

/*
            {
    "title": "Camiseta Dupla Face Star Wars Saga",
    "type": "camiseta",
    "price": "89,90",
    "image": "https://lojapiticas.vteximg.com.br/arquivos/ids/165002-258-258/star-wars-duplace-face-5.png?v=637637756454970000"
}
*/