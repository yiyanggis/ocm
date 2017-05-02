import React, { Component } from 'react';
import { Nav, NavItem, Label, Badge} from 'react-bootstrap';
import {observer} from 'mobx-react';

import {store} from './DataStore';

const FontAwesome = require('react-fontawesome');


export default class NavToolbar extends Component {


    onClick = (e) => {
        console.log(e);
        switch (e) {
            case 1: 
                store.uiState.wantOpenBoundaryTextEditor(undefined);
                break;
            case 3:
                store.uiState.wantOpenWIPView();
                break;
        }
       // store.saveToBackend();
    }


    render() {
        //const wipIcon = wipIconComponent;
        return (
          <Nav onSelect={this.onClick}>
            <NavItem eventKey={1} href="#">
              <Label bsStyle='primary'><FontAwesome name='plus-circle' size='2x'/> Add </Label>  
            </NavItem>
            <NavItem eventKey={3}>
                <WIPIconComponent/>
            </NavItem>
          </Nav>);
      }
}


const WIPIconComponent = observer(() => {
    const count = store.wip.map.size;
    const props = {
        bsStyle: count > 0 ? 'warning' : 'default'
    };
    return (<span><Label {...props}><FontAwesome name='code-fork' size='2x'/> <Badge>{count}</Badge></Label></span>);
});