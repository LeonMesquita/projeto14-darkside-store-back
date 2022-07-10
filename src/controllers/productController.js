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
    userId,
    userEmail,
    products: [
        {
                productId: wishBody.productId,
                itemQuantity: wishBody.itemQuantity,
                price: product.price,
                totalPrice: totalPrice.toFixed(2), 
                title: product.title,
                image: product.image
        }
    ]
}
*/

export async function addItems(req, res){
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");
    const session = await db.collection('sessions').findOne({token});
        if(!session) return res.sendStatus(401);
    const wishBody = req.body;
    if(!wishBody) return res.sendStatus(400);
    try{


        const user = await db.collection('users').findOne({_id: new objectId(session.userId)});



        const product = await db.collection('products').findOne({_id: new objectId(wishBody.productId)});
        if (!product) return res.sendStatus(404);
        const totalPrice = product.price * wishBody.itemQuantity;

        const cart = await db.collection('cart').findOne({userEmail: user.email});
        const newProduct = {
            productId: wishBody.productId,
            itemQuantity: wishBody.itemQuantity,
            price: Number(product.price),
            totalPrice: Number(totalPrice.toFixed(2)), 
            title: product.title,
            image: product.image
        }
        if (!cart){
            await db.collection('cart').insertOne(
                {
                    userId: user._id,
                    userEmail: user.email,
                    products: [newProduct]
                }
            );
            return res.sendStatus(201);
        }

    
        else{
            const filterProducts = cart.products.filter((item) => item.productId !== wishBody.productId);
            if(wishBody.itemQuantity > 0) filterProducts.push(newProduct);
            await db.collection('cart').deleteOne({userEmail: user.email});
            await db.collection('cart').insertOne(
                {
                    userId: user._id,
                    userEmail: user.email,
                    products: filterProducts
                }
            );
            return res.sendStatus(200);   
        }

    }catch(error){
        return res.sendStatus(400);

    }

}

export async function getCart(req, res){
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");



    try{
        const session = await db.collection('sessions').findOne({token});
        if(!session) return res.sendStatus(401);
        const user = await db.collection('users').findOne({_id: new objectId(session.userId)});
        const userCart = await db.collection('cart').findOne({userEmail: user.email});
        return res.status(200).send(userCart);
    }catch(error){
        return res.sendStatus(400)
    }
}

/*

{
    userId,
    userEmail,
    products: [
        {
                productId: wishBody.productId,
                itemQuantity: wishBody.itemQuantity,
                price: product.price,
                totalPrice: totalPrice.toFixed(2), 
                title: product.title,
                image: product.image
        }
    ]
}



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



/*
            await db.collection('cart').insertOne({
               productId: wishBody.productId,
               itemQuantity: wishBody.itemQuantity,
               price: product.price,
               totalPrice, 
               title: product.title,
               image: product.image
              //  totalQuantity
            });
*/