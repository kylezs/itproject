/**
 * @summary Component leveraging the ArtefactView component in view mode
 * @author Zane Duffield
 *
 * Last modified  : 2019-10-26 18:14:39
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
        view: true
    }
    return (
        <GetStatesWrapper
            {...props}
            child={GetFamiliesWrapper}
            childProps={thisChildProps}
        />
    )
}
