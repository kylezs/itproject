import React from 'react';
import { Container } from '@material-ui/core';
import Header from './Header';

export default props => {
    
    const containerStyles = {
        padding: '20px',
    }
    
    return (
        <div>
        <Header />
        <Container style={containerStyles}>
            {props.children}
        </Container>
        </div>
    );
};