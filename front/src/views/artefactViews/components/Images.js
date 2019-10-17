import React from 'react'
import { DropzoneArea } from 'material-ui-dropzone'

export default ({ mode, classes, states, setters, disabled, name }) => {
    var { view } = mode
    var { state } = states
    var { handleSetField } = setters
    return (
        <DropzoneArea
            initialFiles={state.files || []}
            onChange={files => handleSetField(name, files)}
            dropzoneClass={classes.dropzone}
        />
    )
}
