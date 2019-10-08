import React from 'react'
import ArtefactView from './ArtefactView'
import { Layout } from '../components'

export default function EditArtefactView(props) {
    return (
        <Layout>
            <ArtefactView mode={'create'} />
        </Layout>
    )
}
