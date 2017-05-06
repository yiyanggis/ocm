import React, { Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { observer } from 'mobx-react';
import FontAwesome from 'react-fontawesome';

import {store} from '../DataStore';
import WorkspaceDetail from './WorkspaceDetail';

const Dashboard = observer(class extends Component {


    render() {
        return (
            <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
                <Tab eventKey={1} title="Workspace"><WorkspaceDetail/></Tab>
                <Tab eventKey={2} title="Add Climb">Add Climb</Tab>
                <Tab eventKey={3} title="Add Area"></Tab>
            </Tabs>
            )
    }    
});


export default Dashboard;