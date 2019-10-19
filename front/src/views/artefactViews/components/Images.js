import React, { Fragment } from 'react'
import { DropzoneArea } from 'material-ui-dropzone'
import { Typography, Container } from '@material-ui/core'
import Image from 'material-ui-image'
import { useTheme } from '@material-ui/styles'

import { config } from '../../../constants'
import { Loading } from '../../../components'

export default ({ classes, states, setters, name }) => {
    const theme = useTheme()
    var { edit, create, view } = states.mode
    var { state } = states
    var { handleSetField } = setters
    return (
        <Fragment>
            <Typography variant='h6' className={classes.fieldTitle}>
                Images
            </Typography>
            {edit && (
                <Typography variant='caption' className={classes.fieldTitle}>
                    Editing coming soon...
                </Typography>
            )}

            {create && (
                <DropzoneArea
                    initialFiles={state.files || []}
                    acceptedFiles={['image/*']}
                    dropzoneText=''
                    filesLimit={1}
                    onChange={files => handleSetField(name, files)}
                    dropzoneClass={classes.dropzone}
                    classes={{
                        dropzoneTextStyle: classes.fieldTitle,
                        dropzoneParagraph: classes.fieldTitle
                    }}
                />
            )}
            {(view || edit) && state.upload !== 'False' && (
                <Image
                    src={config.mediaRoot + state.upload}
                    loading={<Loading />}
                    color={theme.palette.background.paper}
                    imageStyle={{ borderRadius: 10 }}
                />
            )}
        </Fragment>
    )
}
