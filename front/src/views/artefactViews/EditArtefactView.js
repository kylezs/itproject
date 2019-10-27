/**
 * @summary Component leveraging the ArtefactView component in edit mode
 * @author Zane Duffield
 *
 * Last modified  : 2019-10-26 18:14:54
 */

import React from 'react'
import ArtefactView from './ArtefactView'
import {
    GetArtefactWrapper,
    GetFamiliesWrapper,
    GetStatesWrapper
} from '../../components'

export default function EditArtefactView(props) {
    const thisChildProps = {
        child: GetArtefactWrapper,
        childProps: {
            child: ArtefactView
        },
        edit: true
    }

    return (
            <GetStatesWrapper
                {...props}
                child={GetFamiliesWrapper}
                childProps={thisChildProps}
            />
    )
}
