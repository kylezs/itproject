import React from 'react'
import { Layout } from '../components'
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
        view: true
    }
    return (
        <Layout>
            <GetStatesWrapper
                {...props}
                child={GetFamiliesWrapper}
                childProps={thisChildProps}
            />
        </Layout>
    )
}
