function json(res) {
    return res.json()
}

function callGraphQL(graphqlQuery) {
    return fetch('http://localhost:4001/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({query: graphqlQuery})
    })
    .then(json)
    .then(function(res) {
        return res.data
    })
}