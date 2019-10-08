import React, { useState, Fragment } from 'react'
import { Container } from '@material-ui/core'
import Header from './Header'

import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'

export default props => {
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
            type: 'dark'
        }
    })

    const toggleDarkTheme = () => {
        var newPaletteType = theme.palette.type === 'light' ? 'dark' : 'light'
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
