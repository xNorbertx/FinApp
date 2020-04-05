export function getTransactionTypeDef() {
    return [`
        type Query {
            transaction(_id: String): Transaction
            transactions: [Transaction]
            transactionsByCategory(categoryId: String): [Transaction]
            category(_id: String): Category
            categories: [Category]
        }

        type Category {
            _id: String
            name: String
            type: String
            totalValue: Float
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
    `]
}

