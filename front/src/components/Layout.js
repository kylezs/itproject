import React from 'react';
import { Container } from '@material-ui/core';
import Header from './Header';

export default props => {
    return (
        <div>
        <Header />
        <Container>
            {props.children}
        </Container>
        </div>
    );
};