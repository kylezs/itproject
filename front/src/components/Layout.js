/**
 * This file renders it's children below a header and provides
 * a theme to it's children to be accessed via the useTheme hook
 *
 * @summary Provides the basic structure and theming for most pages
 * @author Zane Duffield
 *
 * Last modified  : 2019-10-26 18:02:38
 */

import React, { useState } from 'react'
import { CssBaseline } from '@material-ui/core'
import Header from './Header'

import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import { teal, deepPurple, indigo } from '@material-ui/core/colors'

import { THEME_TYPE } from '../constants.js'

const typography = {
    fontFamily: 'Dosis, Roboto, sans-serif',
    h1: {
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 100
    },
    h2: {
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 100
    },
    h3: {
        fontFamily: 'Roboto, sans-serif'
    },
    h4: {
        fontFamily: 'Roboto, sans-serif'
    },
    h5: {
        fontFamily: 'Roboto, sans-serif'
    },
    h6: {
        fontFamily: 'Roboto, sans-serif'
    }
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
        main: deepPurple['A100']
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

let lightTheme = createMuiTheme({
    palette: lightPalette,
    type: 'light',
    typography: typography
})
lightTheme = responsiveFontSizes(lightTheme)

let darkTheme = createMuiTheme({
    palette: darkPalette,
    type: 'dark',
    typography: typography
})
darkTheme = responsiveFontSizes(darkTheme)

export default props => {
    // Get the user's theme from local storage. This will clear if localStorage.clear()
    if (!localStorage.getItem(THEME_TYPE)) {
        localStorage.setItem(THEME_TYPE, 'light')
    }

    const [theme, setTheme] = useState(
        localStorage.getItem(THEME_TYPE) === 'light' ? lightTheme : darkTheme
    )

    // Called on click of dark theme button
    const toggleDarkTheme = () => {
        var newTheme = theme.palette.type === 'light' ? 'dark' : 'light'
        localStorage.setItem(THEME_TYPE, newTheme)
        setTheme(newTheme === 'light' ? lightTheme : darkTheme)
    }

    const [helpOpen, setHelpOpen] = useState(false)
    const children = React.Children.map(props.children, child => {
        return React.cloneElement(child, {
            helpOpen: helpOpen,
            setHelpOpen: setHelpOpen
        })
    })

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Header
                onToggleDarkTheme={toggleDarkTheme}
                setHelpOpen={setHelpOpen}
            />
            {children}
        </ThemeProvider>
    )
}
