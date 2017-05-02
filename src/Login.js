import React, { Component } from 'react';
import {NavItem, MenuItem, NavDropdown} from 'react-bootstrap';
const osmAuth = require('osm-auth'); 


const auth = osmAuth({
    oauth_secret: 'PozVuo2EL6O3SAfNweylfErQEMNiVIQ9VTdl8u7y',
    oauth_consumer_key: '1j0ulRUL3evjuveoB6Dsmf8hh3n1eshxXGDgARDD',
    landing: 'osm-post-auth.html',
    singlepage: false,
    auto: true
});


export default class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            osm_authenticated: false,
            osm_username: '',
        }
    }




    render() {
        if (this.state.osm_authenticated) {
            return (<NavDropdown title={this.state.osm_username} key={1} id={1}>
                        <MenuItem eventKey="1" onClick={this.handleLogout}>Logout</MenuItem>
                    </NavDropdown>
            ); 
        } else {
            return (
                <NavItem eventKey={1} onClick={this.handleLogin }>Login</NavItem>

            );
        }

    }


    handleLogin = (event) => {
        this._authOSM();
    }


    _authOSM = () => {
        console.log('OSM login...');
        auth.xhr({
                            method: 'GET',
                path: '/api/0.6/user/details'
        }, (error, response) => {
                if (error) {
                    this.onAuthError(error);
                } else {
                    this.onAuthSuccess(response);
                }
            });
    }


    handleLogout = (event) => {
        this.setState({
            osm_authenticated: false,
            osm_username: ''
        });
        auth.logout();
    }


    onAuthError = (error) => {
        // do something with error
        console.log('error', error);
    }


    onAuthSuccess = (response) => {
        // yay!
        console.log('success', response);
        const userXml = response.getElementsByTagName('user')[0];
        console.log(userXml.getAttribute('display_name'));

        this.setState({
            osm_authenticated: true,
            osm_username: userXml.getAttribute('display_name'),
            osm_userid: userXml.getAttribute('id')
        });

    }
}