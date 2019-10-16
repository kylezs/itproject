import gql from 'graphql-tag'

// Get the id back to allow for querying for the artefact later
export const CREATE_ARTEFACT_MUTATION = gql`
    mutation CreateArtefactMutation(
        $name: String!
        $state: String!
        $isPublic: Boolean
        $description: String!
        $belongsToFamilies: [ID]
        $address: String
        $date: String
    ) {
        artefactCreate(
            input: {
                name: $name
                state: $state
                description: $description
                isPublic: $isPublic
                belongsToFamilies: $belongsToFamilies
                address: $address
                date: $date
            }
        ) {
            artefact {
                id
            }
        }
    }
`

export const GET_ARTEFACT_STATES_QUERY = gql`
    query ArtefactStatesQuery($name: String!) {
        __type(name: $name) {
            enumValues {
                name
                description
            }
        }
    }
`

export const GET_FAMILIES_QUERY = gql`
    query artefactsQuery {
        me {
            isMemberOf {
                familyName
                id
            }
        }
    }
`

export const GET_MY_ID_QUERY = gql`
    query artefactsQuery {
        me {
            id
        }
    }
`

export const ARTEFACT_DETAIL = gql`
    query DetailView($id: ID!) {
        artefact(id: $id) {
            id
            name
            description
            admin {
                id
                username
            }
            state
            isPublic
            upload
            belongsToFamilies {
                id
            }
            addedAt
            address
            date
        }
    }
`

export const UPDATE_ARTEFACT_MUTATION = gql`
    mutation UpdateArtefactMutation(
        $id: ID!
        $artefactInput: ArtefactInputType!
    ) {
        artefactUpdate(id: $id, input: $artefactInput) {
            artefact {
                id
            }
        }
    }
`

export const LOGIN_MUTATION = gql`
    mutation TokenAuth($username: String!, $password: String!) {
        tokenAuth(username: $username, password: $password) {
            token
        }
    }
`

export const GET_FAMILY_ARTEFACTS = gql`
    query getFamilyArtefacts($id: ID!) {
        family(id: $id) {
            hasArtefacts {
                edges {
                    node {
                        id
                        name
                        description
                        address
                    }
                }
            }
        }
    }
`

export const SIGNUP_MUTATION = gql`
    mutation SignupMutation(
        $email: String!
        $password: String!
        $username: String!
    ) {
        createUser(email: $email, username: $username, password: $password) {
            user {
                id
                username
                email
            }
        }
    }
`

// Get the familyName and joinCode back to present to the user straight away after
// successful creation
export const CREATE_FAMILY_MUTATION = gql`
    mutation FamilyCreate($familyName: String!, $about: String) {
        familyCreate(input: { familyName: $familyName, about: $about }) {
            family {
                familyName
                joinCode
            }
        }
    }
`