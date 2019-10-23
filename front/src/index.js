import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import * as serviceWorker from './serviceWorker'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloProvider } from '@apollo/react-hooks'
import Auth from './components/Auth'

import App from './App'
import { AUTH_TOKEN, config } from './constants'

// Depending on prod or dev, set the appropriate uri for the graphql queries
const httpLink = createHttpLink({
    uri: config.uri
})

const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = localStorage.getItem(AUTH_TOKEN)
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? `JWT ${token}` : ''
        }
    }
})

const defaultOptions = {
    watchQuery: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
    },
    query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
    },
}

// Set up Apollo client using Jwt auth
const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: defaultOptions
})

// Wrap application with Apollo and Auth providers to give access across the application
ReactDOM.render(
    <ApolloProvider client={client}>
        <Auth>
            <App />
        </Auth>
    </ApolloProvider>,
    document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
