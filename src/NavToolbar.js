import React, { Component } from 'react';
import { Nav, NavItem} from 'react-bootstrap';

import {store} from './DataStore';

const FontAwesome = require('react-fontawesome');


export default class NavToolbar extends Component {


    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }


    onClick(e) {
        store.saveToBackend();
    }


    render() {
        return (
          <Nav onSelect={this.onClick}>
            <NavItem eventKey={1} href="#">
              <FontAwesome name='plus-circle'/>
            </NavItem>
            <NavItem eventKey={2} href="#">
              <FontAwesome name='refresh'/>
            </NavItem>
            <NavItem eventKey={3} href="#">
              <FontAwesome name='upload'/>
            </NavItem>
          </Nav>);
      }
}