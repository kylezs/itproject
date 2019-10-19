import React from 'react'

export default function Error404View(props) {
    return (
        <div style={{padding:'50px'}}>
            <h1 style={{color: 'red'}}>404 Page Not Found</h1>
            <h3>If you're seeing this page...</h3>
            <img src="https://media0.giphy.com/media/KVZXay4Uduy8XHpZRc/giphy.gif" alt='You are lost - Obi Wan'/>
            <p><a href="/">Return home</a></p>
        </div>
    )
}