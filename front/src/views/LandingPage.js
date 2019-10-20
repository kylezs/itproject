import React, { useState, useEffect } from 'react'
import Particles from 'react-particles-js'
import { Button } from '@material-ui/core'
import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import Typography from '@material-ui/core/Typography'
import Typist from 'react-typist'
import { Link as RouterLink } from 'react-router-dom'

/*
The page that users come to when they first encounter our app. It's a marketing page

*/
function HomePageButton(props) {
    const { linkTo } = props
    return (
        <Button
            style={{
                color: '#f0f0f0',
                padding: '12px',
                margin: '4px',
                marginTop: '8px'
            }}
            component={RouterLink}
            to={linkTo}
        >
            {props.children}
        </Button>
    )
}

function LandingPage(props) {
    // Help the landing page be mobile friendly
    let landingTheme = createMuiTheme()
    landingTheme = responsiveFontSizes(landingTheme)

    // Allow for looping of the typing animation
    const [typing, setTyping] = useState(true)
    useEffect(() => {
        setTyping(true)
    }, [typing])

    const typingDone = () => {
        setTyping(false)
    }

    return (
        <div>
            <ThemeProvider theme={landingTheme}>
                <link
                    href='https://fonts.googleapis.com/css?family=Dosis&display=swap'
                    rel='stylesheet'
                ></link>
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        right: '20px',
                        zIndex: 4
                    }}
                >
                    <HomePageButton linkTo='/signup'>Sign up</HomePageButton>
                    <HomePageButton linkTo='/login'>Login</HomePageButton>
                </div>
                <Typography
                    theme={landingTheme}
                    variant='h1'
                    style={{
                        marginLeft: '8%',
                        marginRight: '8%',
                        marginTop: '10%',
                        zIndex: 3,
                        position: 'relative',
                        fontWeight: 'lighter',
                        fontFamily: 'Dosis',
                        color: '#f0f0f0'
                    }}
                >
                    Family Artefacts Register
                </Typography>
                <Typography
                    variant='h2'
                    theme={landingTheme}
                    style={{
                        marginLeft: '8%',
                        marginRight: '8%',
                        marginTop: '1%',
                        zIndex: 3,
                        position: 'relative',
                        top: '8rem',
                        fontWeight: 'lighter',
                        fontFamily: 'Dosis',
                        color: '#f0f0f0'
                    }}
                >
                    {typing ? (
                        <Typist
                            cursor={{ show: false }}
                            onTypingDone={typingDone}
                        >
                            <Typist.Delay ms={400} />
                            <span>Connecting you to your family</span>
                            <span> and your familys history.</span>
                            <Typist.Backspace count={10} delay={200} />
                            <span>'s history.</span>
                            <Typist.Backspace count={56} delay={5000} />
                        </Typist>
                    ) : (
                        ''
                    )}
                </Typography>
                <Particles
                    style={{
                        position: 'fixed',
                        left: 0,
                        top: 0,
                        background: 'rgb(103, 58, 183)',
                        background:
                            'linear-gradient(90deg, rgba(103, 58, 183, 1) 25%, rgba(63, 81, 181, 1) 100%, rgba(255, 255, 255, 1) 100%)'
                    }}
                    params={{
                        particles: {
                            number: {
                                value: 120,
                                density: {
                                    enable: true,
                                    value_area: 800
                                }
                            },
                            color: {
                                value: '#ffffff'
                            },
                            shape: {
                                type: 'circle',
                                stroke: {
                                    width: 0,
                                    color: '#FFFFFF'
                                },
                                polygon: {
                                    nb_sides: 5
                                },
                                image: {
                                    src: 'img/github.svg',
                                    width: 100,
                                    height: 100
                                }
                            },
                            opacity: {
                                value: 0.44093831673801875,
                                random: false,
                                anim: {
                                    enable: false,
                                    speed: 1,
                                    opacity_min: 0.1,
                                    sync: false
                                }
                            },
                            size: {
                                value: 4.008530152163807,
                                random: true,
                                anim: {
                                    enable: false,
                                    speed: 40,
                                    size_min: 0.1,
                                    sync: false
                                }
                            },
                            line_linked: {
                                enable: true,
                                distance: 150,
                                color: '#ffffff',
                                opacity: 0.4,
                                width: 1
                            },
                            move: {
                                enable: true,
                                speed: 6,
                                direction: 'none',
                                random: false,
                                straight: false,
                                out_mode: 'out',
                                bounce: false,
                                attract: {
                                    enable: false,
                                    rotateX: 600,
                                    rotateY: 1200
                                }
                            }
                        },
                        interactivity: {
                            detect_on: 'canvas',
                            events: {
                                onhover: {
                                    enable: true,
                                    mode: 'grab'
                                },
                                onclick: {
                                    enable: true,
                                    mode: 'push'
                                },
                                resize: true
                            },
                            modes: {
                                grab: {
                                    distance: 400,
                                    line_linked: {
                                        opacity: 1
                                    }
                                },
                                bubble: {
                                    distance: 400,
                                    size: 40,
                                    duration: 2,
                                    opacity: 8,
                                    speed: 3
                                },
                                repulse: {
                                    distance: 200,
                                    duration: 0.4
                                },
                                push: {
                                    particles_nb: 4
                                },
                                remove: {
                                    particles_nb: 2
                                }
                            }
                        },
                        retina_detect: true
                    }}
                ></Particles>
            </ThemeProvider>
        </div>
    )
}
export default LandingPage
