import React from 'react'
import ArtefactView from './ArtefactView'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { Layout } from '../components'

export default function EditArtefactView(props) {
    return (
        <Layout>
            <ArtefactView mode={'create'} />
        </Layout>
    )
}
