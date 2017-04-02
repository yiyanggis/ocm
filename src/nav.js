import React, { Component } from 'react';
import { Navbar, Nav, NavItem, NavDropdown} from 'react-bootstrap';

import NavToolbar from './NavToolbar';

export default class MyNavbar extends Component {
  render() {
  return(
      <Navbar inverse collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <NavToolbar/>
          <Nav pullRight>
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