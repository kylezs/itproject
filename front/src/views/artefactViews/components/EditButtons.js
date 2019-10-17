import React from 'react'
import { Button, Grid, FormHelperText } from '@material-ui/core'

export default ({ save, cancel, updateErrors, classes }) => {
    function MyButton(props) {
        return (
            <Button
                variant='contained'
                color={props.color}
                className={classes.button}
                onClick={props.onClick}
                fullWidth
                padding={1}
            >
                {props.name}
            </Button>
        )
    }

    return (
        <Grid
            container
            justify='space-evenly'
            alignItems='center'
            spacing={1}
            style={{ marginTop: 1 }}
        >
            <Grid item xs={6}>
                <MyButton onClick={save} name='Save' color='primary' />
            </Grid>
            <Grid item xs={6}>
                <MyButton
                    onClick={cancel}
                    name='Cancel'
                    color='secondary'
                />
            </Grid>

            {updateErrors && (
                <Grid item xs={12}>
                    <FormHelperText error>
                        Error Updating Artefact
                    </FormHelperText>
                </Grid>
            )}
        </Grid>
    )
}
