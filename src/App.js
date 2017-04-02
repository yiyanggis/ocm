import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Navbar, Nav, NavItem, NavDropdown, Button, Modal, Grid, Row, Col} from 'react-bootstrap';
import MyNavbar from './nav'
import MainMap from './Map'


class OpenClimbMapApp extends Component {

  constructor(props){
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.state = {
      editMode: false
    };
  }



  handleClick() {
    let currentState = this.state.editMode;
    console.log("state before " + this.state.editMode);

    this.setState({ editMode: ! currentState});
    console.log("state after " + this.state.editMode);
  }

  render (){
    return (
      <div>hello</div>
      )
  }
};

export default OpenClimbMapApp;

       // {this.state.editMode === true &&
       //   <RouteEditorModal show={true} onHideHandler={this.handleClick}/>
       // }
       //        <Button onClick={this.handleClick}>hello</Button>
