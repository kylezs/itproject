import React, { Fragment } from 'react'

import { Button, FormHelperText } from '@material-ui/core'

export default ({ noErrors }) => (
    <Fragment>
        <Button
            name='create'
            label='Create'
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
        >
            Create
        </Button>
        {!noErrors && (
            <FormHelperText error={!noErrors}>
                Unknown Error Occurred
            </FormHelperText>
        )}
    </Fragment>
)
