import React, { Component } from 'react';
import {observer} from 'mobx-react';

import {store} from '../DataStore';
import {
    Card,
    Grid,
    Label,
    Icon,
    Button,
    Divider
} from 'semantic-ui-react';
import {
    Form, 
    Input,
    TextArea, 
    Checkbox, 
    Radio,
    RadioGroup, 
    Dropdown, 
    Select,
  } from 'formsy-semantic-ui-react';


const BoundaryAddView = () => {
    return (
        <Card fluid>
            <Card.Content>
                <Card.Header>Add an Area - Entry Form</Card.Header>
                    <Card.Description>
                        <EntryForm />
                    </Card.Description>
            </Card.Content>

        </Card>
    );
}
export default BoundaryAddView  




class EntryForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            canSubmit: false
        }
        this.errorLabel = <Label color="red" pointing/>        
    }
    
    enableButton = () => {
        this.setState(() => ({canSubmit: true}))
    }

    disableButton = () => {
        this.setState(() => ({canSubmit: false}));
    }   

    render() {
        return (
            <Form
                onValidSubmit={ onValidSubmit }
                onValid={this.enableButton} 
                onInvalid={this.disableButton}
            >
                <Divider />

                <Form.Field>
                    <label>Is this a Top level area?</label>
                    <Form.Radio toggle name="topLevel" label="No" size="huge" />
                </Form.Field>

                <Form.Input
                    name="name"
                    label="Area Name"
                    size="huge"
                    required
                    validations="minLength:2,maxLength:80"
                    validationErrors={{ 
                        minLength: 'Minimum of 2 characters',
                        maxLength: 'Maximum of 80 characters' }}
                    errorLabel={ this.errorLabel }
                />
                <Form.Field>
                    <label>Draw and select an area from map</label>
                    <Form.Button basic content='Begin' 
                            size='huge'
                            icon='right arrow' 
                            labelPosition='right' 
                            onClick={activatePolygonEditToolHandler}
                            />
                </Form.Field>
                
                <Divider />
                <Form.Button type='submit' basic fluid positive 
                            content='Submit Entry' 
                            size="huge" 
                            disabled={!this.state.canSubmit} />
            </Form>);
        }
}

const onValidSubmit = (e) => {
    e.preventDefault();
    console.log('onValidSubmit()', e);
}

const activatePolygonEditToolHandler = (event, data) => {
    console.log(event);
    event.preventDefault();
  //  store.uiState.showPolygonTool(data);
}