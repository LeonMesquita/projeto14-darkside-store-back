import {db, objectId} from '../db/mongo.js';


export async function payOrder(req, res){
    const user = res.locals.user;
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
    const user = res.locals.user;
    try{
        const orders = await db.collection('orders').find({userId: user._id}).toArray();
        return res.status(200).send(orders);
        
    }catch{

    }
}