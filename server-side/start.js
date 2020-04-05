
import express from 'express'
import bodyParser from 'body-parser'
import {graphqlExpress, graphiqlExpress} from 'graphql-server-express'
import {makeExecutableSchema} from 'graphql-tools'
import cors from 'cors'
import {createResolvers, initDb} from './db'
import {getTransactionTypeDef} from './typedefs/typedef-transaction'

const app = express()

const homePath = '/graphiql'
const apiPath = '/api'
const URL = 'http://localhost'
const PORT = 4001

export const start = async () => {
  try {
    await initDb()

    const resolvers = createResolvers()
    const typeDefs = getTransactionTypeDef()

    const schema = makeExecutableSchema({
      typeDefs,
      resolvers
    })

    //middleware
    app.use(cors())

    app.use(express.static('client-side'))
    app.use(express.json())

    app.use('/graphql', bodyParser.json(), graphqlExpress({schema}))
    app.use(homePath, graphiqlExpress({
      endpointURL: '/graphql'
    }))

    //routing
    app.post(`${apiPath}/graphql`, function(req, res) {
      res.status(200).json()
    }) 

    app.listen(PORT, () => {
      console.log(`Visit ${URL}:${PORT}${homePath}`)
    })

  } catch (e) {
    console.log(e)
  }
}
