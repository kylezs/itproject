import React from 'react'
import Layout from '../components/Layout'

// NB: REMOVE THE LAYOUT, THIS SHOULD NOT HAVE THE APP BAR, THIS SHOULD BE EXTRA COOL DESIGNED PAGE
function LandingPage(props) {
    return (
        <div>
            <div id="particles-js"></div>
            <div class="count-particles"></div>
            <span class="js-count-particles"></span>
            <script src="http://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"></script>
            <script src="http://threejs.org/examples/js/libs/stats.min.js"></script>
        </div>
    )
}
export default LandingPage
