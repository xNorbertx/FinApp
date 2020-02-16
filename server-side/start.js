import {MongoClient, ObjectId} from 'mongodb'
import express from 'express'
import bodyParser from 'body-parser'
import {graphqlExpress, graphiqlExpress} from 'graphql-server-express'
import {makeExecutableSchema} from 'graphql-tools'
import cors from 'cors'
import {prepare} from "../util/index"


const app = express()

app.use(cors())

app.use(express.static('../client-side'))
app.use(express.json())

const homePath = '/graphiql'
const URL = 'http://localhost'
const PORT = 4001
const MONGO_URL = 'mongodb://localhost:27017/finance'

export const start = async () => {
  try {
    const db = await MongoClient.connect(MONGO_URL)

    const Transactions = db.collection('transaction')

    const typeDefs = [`
      type Query {
        transaction(_id: String): Transaction
        transactions: [Transaction]
      }

      type Transaction {
        _id: String
        value: Float
        valid: Boolean
        date: String
        dateEntry: String
        categoryId: String
        userId: String
      }

      type Mutation {
        insertTransaction(userId: String, categoryId: String, value: Float, date: String): Transaction
      }

      schema {
        query: Query
        mutation: Mutation
      }
    `];

    const resolvers = {
      Query: {
        transaction: async (root, {_id}) => {
          return prepare(await Transactions.findOne(ObjectId(_id)))
        },
        transactions: async () => {
          return (await Transactions.find({}).toArray()).map(prepare)
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
      },
    }

    const schema = makeExecutableSchema({
      typeDefs,
      resolvers
    })


    app.use('/graphql', bodyParser.json(), graphqlExpress({schema}))


    app.use(homePath, graphiqlExpress({
      endpointURL: '/graphql'
    }))

    app.listen(PORT, () => {
      console.log(`Visit ${URL}:${PORT}${homePath}`)
    })

  } catch (e) {
    console.log(e)
  }

}
