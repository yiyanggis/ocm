import React, { Component } from 'react';
import { Nav, NavItem, MenuItem, NavDropdown, Label, Badge } from 'react-bootstrap';
import { observer } from 'mobx-react';

import {store} from './DataStore';

const FontAwesome = require('react-fontawesome');


export default class NavToolbar extends Component {


    onClick = (e) => {
        console.log(e);
        switch (e) {
            case 1: 
                alert("Add a climb coming soon.  Please try to add an Area!");
                break;
            case 2:
                store.uiState.wantBeginBoundaryDrawing(undefined);
                break;
            case 4:
                store.uiState.wantOpenWIPView();
                break;
        }
       // store.saveToBackend();
    }


    render() {
        return (
          <Nav onSelect={this.onClick}>
            <NavDropdown id='Add-climb-or-area' title={<span><FontAwesome name='plus'/>&nbsp;&nbsp;Add</span>}>
                <MenuItem eventKey={1} href="#">
                    <FontAwesome name='map-marker'/>&nbsp;&nbsp;Climb
                </MenuItem>
                <MenuItem eventKey={2}>
                    <FontAwesome name='object-group'/>&nbsp;&nbsp;Area
                </MenuItem>
                <MenuItem divider/>
                <MenuItem eventKey={3}>
                    Expert edit mode
                </MenuItem>               
            </NavDropdown>
            <NavItem eventKey={4}>
                <WIPIconComponent/>
            </NavItem>            
          </Nav>);
      }
}


const WIPIconComponent = observer(() => {
    const count = store.wip.map.size;
    const props = {
        bsStyle: count > 0 ? 'info' : 'default'
    };
    return (<span><FontAwesome name='code-fork'/>&nbsp;&nbsp;Workspace &nbsp;<Badge>{count}</Badge></span>);
});