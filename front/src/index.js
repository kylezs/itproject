import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from '@apollo/react-hooks';
import Auth from './components/Auth';

import App from './App';
import { AUTH_TOKEN } from './constants'

// Dev
const httpLink = createHttpLink({
    uri: '/graphql/',
    // credentials: 'same-origin',
})

// TODO: Prod (test), fix this later
// const httpLink = createHttpLink({
//   uri: 'https://glacial-caverns-32653.herokuapp.com/graphql/'
// })

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem(AUTH_TOKEN);
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `JWT ${token}` : "",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

// const client = new ApolloClient({
//     cache,
//     link
// })

ReactDOM.render(
    <ApolloProvider client={client}>
      <Auth>
        <App />
      </Auth>
    </ApolloProvider>
    , document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
