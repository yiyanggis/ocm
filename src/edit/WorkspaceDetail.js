import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { 
    form, 
    FormGroup, 
    ControlLabel, 
    FormControl, 
    Button, ListGroup, 
    ListGroupItem, 
    Accordion, 
    Panel, 
    HelpBlock
} from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

import {store} from '../DataStore';


const WorkspaceDetail = observer(class WorkspaceDetail extends Component {   

    closeModal = () => {
        store.uiState.wantCloseCurrent();
    }


    render() {
/*        if (!store.uiState.shouldWIPOpen.get()) {
            return null;
        }*/
        const list = store.wip.map.entries().map((entry) =>(<EditableItem key={entry[0]} id={entry[0]} feature={entry[1]} />));        

        return (
            <div>
                <WSHeader/>
                <Accordion>
                    {list}
                </Accordion>
            </div>
            )
    }
});


const WSHeader = observer(() => {
    const size = store.wip.map.size;
    if (size > 0) {
        return <p>You are editing: {size} items.</p>;
    } else {
        return <p>Your workspace is empty.</p>;
    }
});


const EditableItem = observer(class EditableItem extends Component {

    onClick = (id) => {
        console.log("onClick", id);
        store.uiState.wantCloseCurrent();
        store.uiState.wantOpenBoundaryTextEditor(id);
    }


    render() {
        console.log("List item:", this.props.feature, this.props.id);
        const geojson_props = this.props.feature.properties;
        const name = geojson_props.name ? geojson_props.name : "Name not defined";
        const type =this.props.feature.geometry.type;
        return (
            <Panel header={this.makeHeader(type, name)} collapsible={true} defaultExpanded={false} eventKey={this.props.id}>
            foo
            </Panel> 
            )
    }

    makeHeader = (type, name) => {
        return <span>{this.makeIcon(type)}&nbsp;{name}</span>
    }

    makeIcon = (type) => {
        switch (type) {
            case 'Polygon':
                return <FontAwesome name='object-group'/>
                break;
            default:
                return null;
        } 
    }
});


const AreaEditForm = observer(class AreaEditForm extends Component {

    render() {
        return(
            <form>
                <FormGroup controlId="name">
                    <ControlLabel>Area name</ControlLabel>
                    <FormControl type="text" placeholder="Enter text" />
                    {<HelpBlock>help!</HelpBlock>}
                </FormGroup>
            </form>
            )
    }
});

export default WorkspaceDetail;