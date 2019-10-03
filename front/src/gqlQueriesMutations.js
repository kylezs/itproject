import gql from 'graphql-tag'

// Get the id back to allow for querying for the artefact later
export const CREATE_ARTEFACT_MUTATION = gql`
    mutation CreateArtefactMutation(
        $name: String!
        $state: String!
        $isPublic: Boolean!
        $description: String!
        $families: [ID]
    ) {
        artefactCreate(
            input: {
                name: $name
                state: $state
                description: $description
                isPublic: $isPublic
                belongsToFamily: $families
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
        }
    }
`
