/**
 * @summary Component leveraging the ArtefactView component in create mode
 * @author Zane Duffield
 *
 * Last modified  : 2019-10-26 18:14:20
 */

import React from 'react'
import ArtefactView from './ArtefactView'
import {
    GetArtefactWrapper,
    GetFamiliesWrapper,
    GetStatesWrapper
} from '../../components'

export default function CreateArtefactView(props) {
    const childProps = {
        child: GetArtefactWrapper,
        childProps: {
            child: ArtefactView
        },
        create: true
    }
    return (
        <GetStatesWrapper
            {...props}
            {...childProps}
            child={GetFamiliesWrapper}
        />
    )
}
