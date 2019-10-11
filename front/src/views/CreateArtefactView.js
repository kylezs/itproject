import React from 'react'
import { Layout } from '../components'
import ArtefactView from './ArtefactView'
import {
    GetArtefactWrapper,
    GetFamiliesWrapper,
    GetStatesWrapper
} from '../components'

export default function EditArtefactView(props) {
    const childProps = {
        child: GetArtefactWrapper,
        edit: true,
        grandchild: ArtefactView
    }
    return (
        <Layout>
            <GetStatesWrapper
                {...props}
                {...childProps}
                child={GetFamiliesWrapper}
            />
        </Layout>
    )
}
