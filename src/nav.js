import React, { Component } from 'react';
import { Navbar, Nav, Image, NavItem} from 'react-bootstrap';

import Login from './Login';
import logo from './logo64x64.png';
import NavToolbar from './NavToolbar';


export default class MyNavbar extends Component {
  render() {
  return(
      <Navbar collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <Image src={logo} />
          </Navbar.Brand>
          {this.props.children}

          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>

            <NavToolbar/>
            <Login/>       
            <Navbar.Text>
              <Navbar.Link href="https://openbeta.io">About</Navbar.Link>
            </Navbar.Text>
            <Navbar.Text>
              <Navbar.Link href="https://github.com/openbeta">GitHub</Navbar.Link>
            </Navbar.Text>
          </Nav>
        </Navbar.Collapse>
    </Navbar>
  );
}
}