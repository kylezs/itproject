import React, { useState } from 'react'
import { CssBaseline } from '@material-ui/core'
import Header from './Header'

import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import { teal, deepPurple, indigo } from '@material-ui/core/colors'

import { THEME_TYPE } from '../constants.js'

const typography = {
    fontFamily: 'Dosis, Roboto, sans-serif',
    h1: {
        fontFamily: 'Roboto, sans-serif'
    },
    h2: {
        fontFamily: 'Roboto, sans-serif'
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

// const typography = {
//     fontFamily: 'Roboto, Dosis, sans-serif',
//     h1: {
//         fontFamily: 'Dosis, sans-serif'
//     },
//     h2: {
//         fontFamily: 'Dosis, sans-serif'
//     },
//     h3: {
//         fontFamily: 'Dosis, sans-serif'
//     },
//     h4: {
//         fontFamily: 'Dosis, sans-serif'
//     },
//     h5: {
//         fontFamily: 'Dosis, sans-serif'
//     },
//     h6: {
//         fontFamily: 'Dosis, sans-serif'
//     }
// }

const lightPalette = {
    primary: indigo,
    secondary: {
        main: teal[400]
    },
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

const lightTheme = createMuiTheme({
    palette: lightPalette,
    type: 'light',
    typography: typography
})

const darkTheme = createMuiTheme({
    palette: darkPalette,
    type: 'dark',
    typography: typography
})

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

    console.log(theme.typography)
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
