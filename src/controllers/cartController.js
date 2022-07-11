import {db, objectId} from '../db/mongo.js';



export async function addItems(req, res){
    const user = res.locals.user;
    const wishBody = req.body;
    if(!wishBody) return res.sendStatus(400);
    try{
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
    const user = res.locals.user;
    try{
        const userCart = await db.collection('cart').findOne({userEmail: user.email});
        return res.status(200).send(userCart);
    }catch(error){
        return res.sendStatus(400)
    }
}


export async function deleteCart(req, res){
    const user = res.locals.user;
    try{
        await db.collection('cart').deleteOne({userEmail: user.email});
        return res.status(200).send("ok");
        
    }catch{
        return res.sendStatus(400);
    }
}