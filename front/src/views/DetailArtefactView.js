import React from 'react'
import gql from "graphql-tag";
import { useQuery } from '@apollo/react-hooks';

const ARTEFACT_DETAIL = gql`
    query DetailView($id: ID!) {
        artefact(id: $id) {
            id,
            name,
            description,
            addedAt
        }
    }`

export default function DetailView(props) {
    let { data, loading, errors } = useQuery(ARTEFACT_DETAIL, {
        variables: { id: props.match.params.id }
    })
    if (loading) {
        return <p>Loading...</p>
    } else if (errors) { return <p>ERROR!</p> }
    return (
        <div>
            <h1>{data.artefact.name} - #{data.artefact.id}</h1>
            <p>{data.artefact.addedAt}</p>
            <p>{data.artefact.description}</p>
        </div>

    )
}   