export const AUTH_TOKEN = 'auth-token'
export const USERNAME_TAKEN_ERR_MSG = `duplicate key`
export const INVALID_CRED_ERR_MSG = `Please, enter valid credentials`

// GQL API for prod vs dev

// Whatever server the app is on, /graphql/
const prod = {
    uri: {
        API_URL: '/graphql/',
    }
};

// In case running dev on either :8000 or :3000, this must be specified as full path
const dev = {
    uri: {
        API_URL: 'http://localhost:8000/graphql/'
    }
};

export const config = process.env.NODE_ENV === 'development' ? dev : prod;