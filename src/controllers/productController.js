import dotenv from 'dotenv';
dotenv.config();
import {db, ObjectId} from '../db/mongo.js'


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


export async function addItems(req, res){
    const wishBody = req.body;
   // const totalQuantity = req.body.totalQuantity;
    if(!wishBody) return res.sendStatus(400);
    try{
        const product = await db.collection('products').findOne({_id: new ObjectId(wishBody.productId)});
        if (!product) return res.sendStatus(404);
        const price = product.price * wishBody.itemQuantity;

        const cart = await db.collection('cart').findOne({productId: wishBody.productId});
        console.log(wishBody.productId)
        console.log(cart);
        if(wishBody.itemQuantity === 0){
            await db.collection('cart').deleteOne({productId: wishBody.productId});
            return res.sendStatus(200);
        }
        if (!cart){
            await db.collection('cart').insertOne({
               productId: wishBody.productId,
               itemQuantity: wishBody.itemQuantity,
               price,
               title: product.title,
               image: product.image
              //  totalQuantity
            });
            return res.sendStatus(201);
        }
        else{
            await db.collection('cart').updateOne(
                {
                    productId: wishBody.productId
                },
                {
                    $set: {
                        itemQuantity: wishBody.itemQuantity,
                        price: price
                    }
                }
            );
            return res.sendStatus(200);   
        }

    }catch(error){
        return res.sendStatus(400);

    }

}


/*
    cart:
    {
            productId
            itemQuantity
    }


*/

/*
            {
    "title": "Camiseta Dupla Face Star Wars Saga",
    "type": "camiseta",
    "price": "89,90",
    "image": "https://lojapiticas.vteximg.com.br/arquivos/ids/165002-258-258/star-wars-duplace-face-5.png?v=637637756454970000"
}
*/