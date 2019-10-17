import React, { Fragment } from 'react'
import { DropzoneArea } from 'material-ui-dropzone'
import { Typography } from '@material-ui/core'

export default ({ mode, classes, states, setters, name }) => {
    var { create } = mode
    var { state } = states
    var { handleSetField } = setters

    if (create) {
        return (
            <Fragment>
                <Typography variant='h6' className={classes.fieldTitle}>
                    Images
                </Typography>
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
            </Fragment>
        )
    } else {
        return <div> render image here, editing coming soon...</div>
    }
}
