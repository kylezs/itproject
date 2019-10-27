/**
 * @summary A wrapper component that provides the details of the users families via props
 * @author Zane Duffield
 *
 * Last modified  : 2019-10-26 17:54:49
 */

import React, { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'

import { GET_FAMILIES_QUERY } from '../gqlQueriesMutations'

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
