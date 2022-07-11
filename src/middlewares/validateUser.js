import {db, objectId} from '../db/mongo.js'
export default async function validateUser(req, res, next){
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');
    const session = await db.collection('sessions').findOne({token});

    if(!session) return res.sendStatus(401);
    const user = await db.collection('users').findOne({_id: new objectId(session.userId)});
    if(!user) return res.sendStatus(401);

    //res.locals.session = session;
    res.locals.user = user;
    next();
}
