import React from 'react'
import ArtefactView from './ArtefactView'
import {
    GetArtefactWrapper,
    GetFamiliesWrapper,
    GetStatesWrapper
} from '../components'

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
