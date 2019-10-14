import React, { useState } from 'react'
import { CssBaseline } from '@material-ui/core'
import Header from './Header'

import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import {
    teal,
    blue,
    deepPurple,
    lightBlue,
    indigo
} from '@material-ui/core/colors'

import { THEME_TYPE } from '../constants.js'

export default props => {
    if (!localStorage.getItem(THEME_TYPE)) {
        localStorage.setItem(THEME_TYPE, 'light')
    }

    const lightPalette = {
        primary: indigo,
        secondary: {
            main: teal[400]
        },
        type: 'light'
    }

    const darkPalette = {
        primary: {
            light: deepPurple[100],
            main: deepPurple['A100'],
            dark: deepPurple[500]
        },
        secondary: teal,
        error: {
            main: '#CF6679'
        },
        background: {
            paper: '#303030',
            default: '#121212'
        },
        type: 'dark'
    }

    const [theme, setTheme] = useState({
        palette:
            localStorage.getItem(THEME_TYPE) === 'light'
                ? lightPalette
                : darkPalette
    })

    const toggleDarkTheme = () => {
        var newPaletteType = theme.palette.type === 'light' ? 'dark' : 'light'
        localStorage.setItem(THEME_TYPE, newPaletteType)
        setTheme({
            palette: newPaletteType === 'light' ? lightPalette : darkPalette
        })
    }

    const muiTheme = createMuiTheme(theme)

    return (
        <ThemeProvider theme={muiTheme}>
            <CssBaseline />
            <Header onToggleDarkTheme={toggleDarkTheme} />
            <div style={{padding: '30px'}}>
            {props.children}
            </div>
        </ThemeProvider>
    )
}
