export const AUTH_TOKEN = 'auth-token'
export const THEME_TYPE = 'theme-type'
export const USERNAME_TAKEN_ERR_MSG = `duplicate key`
export const INVALID_CRED_ERR_MSG = `Please, enter valid credentials`
export const MY_ACCESS_TOKEN =
           'pk.eyJ1IjoiemR1ZmZpZWxkIiwiYSI6ImNrMWdkODhpOTBiM28zZG03eDdjZ2dmN24ifQ.vAzlFYY5S9O82SKnwX69kQ'

// GQL API for prod vs dev

// Whatever server the app is on, /graphql/
const prod = {
    uri: '/graphql/',
    mediaRoot: 'https://artefact-picture.s3.amazonaws.com/media/'
}

// In case running dev on either :8000 or :3000, this must be specified as full path
const dev = {
    uri: 'http://localhost:8000/graphql/',
    mediaRoot: 'http://localhost:8000/media/'
}

// If npm run build => production, if npm start => development (built into react)
export const config = process.env.NODE_ENV === 'development' ? dev : prod
