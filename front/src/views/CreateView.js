import React from 'react'
import gql from "graphql-tag";
import { useMutation } from '@apollo/react-hooks';

const CREATE_ARTEFACT = gql`
mutation ArtefactCreate($artefactInput:ArtefactInputType!) {
  artefactCreate(input: $artefactInput) {
    artefact {
      name,
      description
    }
  }
}`

export default function CreateView(props) {
    let name, description;
    // eslint-disable-next-line
    const [createArtefact, { data, loading, errors }] = useMutation(CREATE_ARTEFACT);
    if (loading) {
        return <div>Loading...</div>;
    } else if (errors) {
        return <p>ERROR!</p>
    }

    return (
        <div>
            <h1>Create an Artefact</h1>
            <form
                onSubmit={e => {
                    e.preventDefault();
                    createArtefact({ variables: {
                        "artefactInput": {
                            "name": name.value,
                            "description": description.value
                        }
                    }
                    });
                    name.value = '';
                    description.value = '';
                }}
            >
                <label>Name</label>
                <input
                    ref={node => {
                        name = node;
                    }}
                />
                <br />
                <label>Description</label>
                <input
                    ref={node => {
                        description = node;
                    }}
                />
                <br />
                <button type="submit">Create</button>
            </form>
        </div>
    );
}
