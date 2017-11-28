import React, {Component} from 'react';
import {observer} from 'mobx-react';

import {drawingBuffer} from '../model/DrawingModel';
import {Card, Label, Divider} from 'semantic-ui-react';
import {Form, Radio} from 'formsy-semantic-ui-react';


const AreaEditView = observer(({layerId}) => {
    const geojson = drawingBuffer.data.get(layerId);
    console.log('AreaEditView', geojson);
    const initialValues = geojson && geojson.layer.toGeoJSON().properties;
    console.log('AreaEditView', initialValues);
    return (
        <Card fluid>
            <Card.Content>
                <Card.Header>Area Boundary - Edit (polygon id: {layerId})</Card.Header>
                    <Card.Description>
                        <EntryForm key={layerId} layerId={layerId} initialValues={initialValues}/>
                    </Card.Description>
            </Card.Content>

        </Card>
    );
}, 'AreaEditView');
export default AreaEditView  


class EntryForm extends Component {
    constructor(props) {
        super(props);
        console.log('EntryForm constructor')
        this.state = {
            canSubmit: false,
            initialValues: this.props.initialValues
        }
        this.errorLabel = <Label color="red" pointing/>     
    }

    componentWillReceiveProps(nextProps) {
        console.log('componentWillReceiveProps', nextProps);
        if (this.props.layerId !== nextProps.layerId) {
            const newData = drawingBuffer.getGeojson(nextProps.layerId).properties;
            
            // For some reason changing initial states alone won't change checkbox 
             // so calling reset() directly 
            this.formRef && this.formRef.reset({topLevel: newData.topLevel}); 
            
            // trigger form pre-population if values exist in drawing buffer
            this.setState(() => ({
                initialValues: newData
            }));        
        }
    }
    
    
    onValid = () => {
        const formModel = this.formRef.formsyForm.getModel();
        const props = {
            name: formModel.name,
            topLevel: formModel.topLevel
        }
        // update buffer with form values
        drawingBuffer.updateFeatureProps(this.props.layerId, props);
        this.setState(() => ({canSubmit: true}))
    }

    disableButton = () => {
        this.setState(() => ({canSubmit: false}));
    }   

    topLevelOnChange = (e, target) => {
        this.setState(() => ({topLevel: target.checked}));
    }

    render() {
        if (this.props.layerId === undefined) {
            return null;
        }
        return (
            <Form
                onValidSubmit={ onValidSubmit }
                onValid={ this.onValid } 
                onInvalid={ this.disableButton}
                onChange={ this.onChange }
                ref={ (form)=> { this.formRef = form } }
            >
                <Divider/>
                <Form.Field>
                    <label>Is this a top level area?</label>
                    <Radio toggle name="topLevel" 
                            label = { this.formRef && this.formRef.formsyForm.getModel().topLevel ? 'Yes' : 'No' }
                            size="huge" />
                </Form.Field>
                <Form.Input
                    name="name"
                    label="Area Name"
                    size="huge"
                    required
                    value={ this.state.initialValues.name }
                    validations="minLength:2,maxLength:80"
                    validationErrors={{ 
                        minLength: 'Minimum of 2 characters',
                        maxLength: 'Maximum of 80 characters' }}
                    errorLabel={ this.errorLabel }
                />            
                <Divider hidden/>
                
                        <Form.Button type='submit' basic positive floated='right'
                            icon='cloud upload'
                            content='Submit Your Entry' 
                            size="huge"
                            disabled={!this.state.canSubmit} />

                </Form>);
        }
}

const onValidSubmit = (e) => {
    //e.preventDefault();
    console.log('onValidSubmit()', e);
}
