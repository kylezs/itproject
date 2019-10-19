import React, { Fragment } from 'react'

import { Button, FormHelperText } from '@material-ui/core'

export default ({ noErrors, ...rest }) => (
    <Fragment>
        <Button
            {...rest}
            type='submit'
        >
            Save
        </Button>
        {!noErrors && (
            <FormHelperText error={!noErrors}>
                Unknown Error Occurred
            </FormHelperText>
        )}
    </Fragment>
)
