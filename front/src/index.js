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

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core'
import { deepPurple, cyan } from '@material-ui/core/colors'

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

const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#757ce8',
            main: '#3f50b5',
            dark: '#002884',
            contrastText: '#fff'
        },
        secondary: {
            light: '#ff7961',
            main: '#f44336',
            dark: '#ba000d',
            contrastText: '#000'
        },
        type: 'dark'
    }
})

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
})

ReactDOM.render(
    <ApolloProvider client={client}>
        <Auth>
            <MuiThemeProvider theme={theme}>
                <App />
            </MuiThemeProvider>
        </Auth>
    </ApolloProvider>,
    document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
