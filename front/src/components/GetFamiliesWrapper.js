import React, { useState } from 'react'
import ArtefactView from '../views/ArtefactView'
import { Layout } from '.'
import { useQuery } from '@apollo/react-hooks'

import {
    GET_ARTEFACT_STATES_QUERY,
    GET_FAMILIES_QUERY
} from '../gqlQueriesMutations'

export default function GetFamiliesWrapper({
    child: Child,
    childProps,
    ...rest
}) {
    // get users families
    const [families, setFamilies] = useState([])
    const { loading } = useQuery(GET_FAMILIES_QUERY, {
        onCompleted: data => setFamilies(data.me.isMemberOf),
        onError: error => console.log(error)
    })

    var thisChildProps = {
        ...childProps,
        families: families,
        familiesLoading: loading
    }

    return <Child {...rest} {...thisChildProps} />
}
