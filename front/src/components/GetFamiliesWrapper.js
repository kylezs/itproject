import React, { useState } from 'react'
import ArtefactView from '../views/ArtefactView'
import { Layout } from '.'
import { useQuery } from '@apollo/react-hooks'

import {
    GET_FAMILIES_QUERY
} from '../gqlQueriesMutations'

export default function GetFamiliesWrapper({
    child: Child,
    childProps,
    ...rest
}) {
    // get users families
    const { data, loading } = useQuery(GET_FAMILIES_QUERY, {
        // onCompleted: data => setFamilies(data.me.isMemberOf),
        onError: error => console.log(error)
    })

    var thisChildProps = {
        ...childProps,
        familiesData: data,
        familiesLoading: loading
    }

    return <Child {...rest} {...thisChildProps} />
}
