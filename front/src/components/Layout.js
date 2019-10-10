import React, { useState } from 'react'
import { Container } from '@material-ui/core'
import Header from './Header'

import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'

import { SET_DARK_MODE_MUTATION } from '../gqlQueriesMutations'
import { useMutation } from '@apollo/react-hooks'
import { THEME_TYPE } from '../constants.js'

export default props => {
    const [myId, setMyId] = useState(0)

    if (!localStorage.getItem(THEME_TYPE)){
        localStorage.setItem(THEME_TYPE, 'light')
        console.log("here")
    }

    const [theme, setTheme] = useState({
        palette: {
            primary: {
                light: '#757ce8',
                main: '#3f50b5',
                dark: '#002884',
                contrastText: '#fff'
            },
            secondary: {
                light: '#ff7961',
                main: '#f44336',
                dark: '#ba000d',
                contrastText: '#000'
            },
            type: localStorage.getItem(THEME_TYPE) || 'light'
        }
    })

    const toggleDarkTheme = () => {
        var newPaletteType = theme.palette.type === 'light' ? 'dark' : 'light'
        localStorage.setItem(THEME_TYPE, newPaletteType)
        setTheme({
            palette: {
                ...theme.palette,
                type: newPaletteType
            }
        })
    }

    const muiTheme = createMuiTheme(theme)

    return (
        <div>
            <ThemeProvider theme={muiTheme}>
                <Header onToggleDarkTheme={toggleDarkTheme} />
                <Container>{props.children}</Container>
            </ThemeProvider>
        </div>
    )
}
