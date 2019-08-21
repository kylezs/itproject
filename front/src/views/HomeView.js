import React from 'react'
import gql from "graphql-tag";
import { Link } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks';


const GET_FIRST_N_ARTEFACTS = gql`{
  artefacts(first:5) {
    edges {
      node {
        id
        name
        addedAt
      }
    }
  }
}`


export default function HomeView() {
    const { data, loading, error } = useQuery(GET_FIRST_N_ARTEFACTS);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>ERROR</p>;

    return (
    <div>
        {data.artefacts.edges.map(item => (
            <p key={item.node.id}>
                <Link to={`/artefacts/${item.node.id}/`}>
                    {item.node.name}
                </Link>
            </p>
        ))}
    </div>
    );
}