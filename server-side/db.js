import {MongoClient, ObjectId} from 'mongodb'
import {prepare} from "../util/index"

let Transactions, Categories

export async function initDb() {
    const MONGO_URL = 'mongodb://localhost:27017/finance'
    const db = await MongoClient.connect(MONGO_URL)

    //set collections
    Transactions = db.collection('transaction')
    Categories = db.collection('category')
}

export function createResolvers() {
    return {
        Query: {
            transaction: async (root, {_id}) => {
              return prepare(await Transactions.findOne(ObjectId(_id)))
            },
            transactions: async () => {
              return (await Transactions.find({}).toArray()).map(prepare)
            },
            transactionsByCategory: async(root, {categoryId}) => {
                return (await Transactions.find({categoryId: categoryId}).toArray()).map(prepare)
            },
            category: async(root, {_id}) => {
                return prepare(await Categories.findOne(ObjectId(_id)))
            },
            categories: async() => {
                return (await Categories.find({}).toArray()).map(prepare)
            }
        },
        Category: {
            totalValue: async(root) => {
                return ((await Transactions.find({categoryId: root._id}).toArray())
                            .map(prepare)
                            .map(x => x.value)
                            .reduce((a,b) => a+b, 0))
            }
        },
        Mutation: {
            insertTransaction: async (root, args, context, info) => {
              args.dateEntry = new Date().toString();
              args.date = new Date(args.date).toString();
              args.valid = true;
              const res = await Transactions.insertOne(args)
              return prepare(res.ops[0])  // https://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#~insertOneWriteOpResult
            }
        }  
    }
}