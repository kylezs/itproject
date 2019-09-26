import React from 'react';
import Layout from '../components/Layout';

// NB: REMOVE THE LAYOUT, THIS SHOULD NOT HAVE THE APP BAR, THIS SHOULD BE EXTRA COOL DESIGNED PAGE
function LandingPage(props) {
    return (
        <Layout>
            This is some cool landing page yo. Welcome!<br />
            Also, in the future, this page should not have a navigation bar, it'll have cooler design stuff. It only has the nav bar
            for easier linking to signup / login for now
        </Layout>
    );
}
export default LandingPage
