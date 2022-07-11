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


export async function favoriteItem(req, res){
    const action = req.params.action;
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");
    const session = await db.collection('sessions').findOne({token});
    if(!session) return res.sendStatus(401);
    const user = await db.collection('users').findOne({_id: new objectId(session.userId)});



    const { productId } = req.body;
    if(!productId) return res.sendStatus(422);
    const product = await db.collection('products').findOne({_id: new objectId(productId)});
    if(!product) return res.sendStatus(404);

    try{
        if(action === "add"){
            await db.collection("favorites").insertOne({
                productId,
                userId: user._id,
                title: product.title,
                type: product.type,
                price: product.price,
                image: product.image
            });
        }
        else if(action === "remove"){
            await db.collection("favorites").deleteOne({productId: productId});
        }
        return res.sendStatus(200);
    }catch(error){
        return res.status(400).send("Falha ao favoritar item");
    }
}

export async function getFavorites(req, res){
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");
    const session = await db.collection('sessions').findOne({token});
    if(!session) return res.sendStatus(401);
    const user = await db.collection('users').findOne({_id: new objectId(session.userId)});

    try{
        const favoritesList = await db.collection('favorites').find({userId: user._id}).toArray();
        return res.status(200).send(favoritesList);

    }catch(error){
        return res.status(404).send('nada encontrado');
    }
}


export async function payOrder(req, res){
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");
    const session = await db.collection('sessions').findOne({token});
    if(!session) return res.sendStatus(401);
    const user = await db.collection('users').findOne({_id: new objectId(session.userId)});

    const order = {
        ...req.body,
        userId: user._id
    };
    try{
        await db.collection('orders').insertOne(
            order
            
        );
        return res.status(201).send('OK');
    }catch(error){
        return res.sendStatus(400);

    }
}


export async function getOrders(req, res){
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");
    const session = await db.collection('sessions').findOne({token});
    if(!session) return res.sendStatus(401);
    const user = await db.collection('users').findOne({_id: new objectId(session.userId)});

    try{
        const orders = await db.collection('orders').find({userId: user._id}).toArray();
        return res.status(200).send(orders);
        
    }catch{

    }
}


export async function deleteCart(req, res){
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");
    const session = await db.collection('sessions').findOne({token});
    if(!session) return res.sendStatus(401);
    const user = await db.collection('users').findOne({_id: new objectId(session.userId)});

    try{
        await db.collection('cart').deleteOne({userEmail: user.email});
        return res.status(200).send("ok");
        
    }catch{
        return res.sendStatus(400);
    }
}