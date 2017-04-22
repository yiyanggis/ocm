import React, { Component } from 'react';
import { Navbar, Nav, Image} from 'react-bootstrap';

import logo from './logo64x64.png';

export default class MyNavbar extends Component {
  render() {
  return(
      <Navbar collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <Image src={logo} />
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          {this.props.children}
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