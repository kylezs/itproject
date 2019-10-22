import React, { useState } from 'react'
import { CssBaseline } from '@material-ui/core'
import Header from './Header'

import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import { teal, deepPurple, indigo } from '@material-ui/core/colors'

import { THEME_TYPE } from '../constants.js'

const lightPalette = {
    primary: indigo,
    secondary: {
        main: teal[400]
    },
    // secondary: teal,
    type: 'light'
}

const darkPalette = {
    primary: {
        // light: deepPurple[100],
        main: deepPurple['A100']
        // dark: deepPurple[500]
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

const lightTheme = createMuiTheme({ palette: lightPalette, type: 'light' })
const darkTheme = createMuiTheme({ palette: darkPalette, type: 'dark' })

export default props => {
    if (!localStorage.getItem(THEME_TYPE)) {
        localStorage.setItem(THEME_TYPE, 'light')
    }

    const [theme, setTheme] = useState(
        localStorage.getItem(THEME_TYPE) === 'light' ? lightTheme : darkTheme
    )

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
