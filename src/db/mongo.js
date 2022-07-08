import { MongoClient, ObjectId } from "mongodb";
import dotenv from 'dotenv';
dotenv.config();


const client = new MongoClient(process.env.MONGO_URI);
let db = null;
client.connect().then(() => {
    db = client.db(process.env.DB_NAME);
});

const objectId = ObjectId;

export {db, ObjectId};