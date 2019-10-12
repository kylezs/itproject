import React, { useState } from 'react'
import { CssBaseline } from '@material-ui/core'
import Header from './Header'

import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import blue from '@material-ui/core/colors/blue'

import { THEME_TYPE } from '../constants.js'

export default props => {
    if (!localStorage.getItem(THEME_TYPE)) {
        localStorage.setItem(THEME_TYPE, 'light')
        console.log('here')
    }

    const [theme, setTheme] = useState({
        palette: {
            primary: blue,
            secondary: {
                light: '#ff7961',
                main: '#f44336',
                dark: '#ba000d',
                contrastText: '#000'
            },
            background: {
                light: '#000000',
                dark: '#121212'
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
        <ThemeProvider theme={muiTheme}>
            <CssBaseline />
            <Header onToggleDarkTheme={toggleDarkTheme} />
            {props.children}
        </ThemeProvider>
    )   
}
