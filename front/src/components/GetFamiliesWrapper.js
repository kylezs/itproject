import React, { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'

import {
    GET_FAMILIES_QUERY
} from '../gqlQueriesMutations'

export default function GetFamiliesWrapper({
    child: Child,
    childProps,
    ...rest
}) {

    const [families, setFamilies] = useState([])
    // get users families
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
