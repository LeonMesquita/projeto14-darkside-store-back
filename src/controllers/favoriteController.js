import {db, objectId} from '../db/mongo.js';


export async function favoriteItem(req, res){
    const action = req.params.action;
    const user = res.locals.user;
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
    const user = res.locals.user;
    try{
        const favoritesList = await db.collection('favorites').find({userId: user._id}).toArray();
        return res.status(200).send(favoritesList);

    }catch(error){
        return res.status(404).send('nada encontrado');
    }
}