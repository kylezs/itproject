import React, { Fragment } from 'react'
import {
    TextField,
    Grid,
    IconButton,
    Popover,
    List,
    ListItem,
    ListItemText,
} from '@material-ui/core'
import { useTheme } from '@material-ui/styles'
import SearchIcon from '@material-ui/icons/Search'
import { Map } from '../../../components'

export default ({
    mode,
    states,
    setters,
    classes,
    name,
    handleGeocodeQuery,
    disabled
}) => {
    var { view } = mode
    var {
        handleSetField,
        setAddressIsSearchResult,
        setLocationState,
        handleSetLocationResult
    } = setters
    var { locationState, state } = states

    const theme = useTheme()
    var mapStyle
    if (theme && theme.palette.type === 'dark') {
        mapStyle = 'mapbox://styles/mapbox/dark-v10?optimize=true'
    } else {
        mapStyle = 'mapbox://styles/mapbox/streets-v9?optimize=true'
    }

    return (
        <Fragment>
            <TextField
                id='address'
                label='Address'
                variant='outlined'
                fullWidth
                disabled={disabled}
                value={state.address || ''}
                inputProps={{
                    readOnly: view
                }}
                onChange={e => {
                    handleSetField(name, e.target.value)
                    if (e.target.value) {
                        setAddressIsSearchResult(false)
                    } else {
                        // allow blank address
                        setAddressIsSearchResult(true)
                    }
                }}
                error={!!locationState.error}
                InputProps={{
                    endAdornment: !view && (
                        <IconButton
                            className={classes.iconButton}
                            aria-label='search'
                            id='search'
                            onClick={e =>
                                handleGeocodeQuery({
                                    query: state.address,
                                    initial: false
                                })
                            }
                        >
                            <SearchIcon />
                        </IconButton>
                    ),
                    style: { marginBottom: 3 }
                }}
                onKeyDown={e => {
                    if (e.keyCode === 13 && !view) {
                        e.preventDefault()
                        document.getElementById('search').click()
                    }
                }}
                helperText={locationState.error}
            />
            <Popover
                id={locationState.queryResults.length ? 'results' : undefined}
                open={!!locationState.queryResults.length}
                anchorEl={document.getElementById('address')}
                onClose={e =>
                    setLocationState({
                        ...locationState,
                        queryResults: []
                    })
                }
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left'
                }}
            >
                <List component='div' disablePadding>
                    {locationState.queryResults.map(result => (
                        <ListItem
                            key={result.placeName}
                            button
                            className={classes.nested}
                            onClick={e => handleSetLocationResult(result)}
                        >
                            <ListItemText primary={result.placeName} />
                        </ListItem>
                    ))}
                </List>
            </Popover>

            <Grid container style={{ marginTop: 1 }}>
                <Map
                    interactive={false}
                    className={classes.map}
                    mapState={locationState.mapState}
                    mapStyle={mapStyle}
                    containerStyle={{
                        height: '60vh',
                        width: '100vw',
                        borderRadius: 20,
                        marginTop: 5
                    }}
                    artefacts={[
                        {
                            center: locationState.mapState.center
                        }
                    ]}
                />
            </Grid>
        </Fragment>
    )
}
