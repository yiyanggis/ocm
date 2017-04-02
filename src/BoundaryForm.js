import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {FormGroup, ControlLabel, FormControl, HelpBlock, Button, ButtonToolbar, Checkbox} from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import MobxReactForm from 'mobx-react-form';
import validatorjs from 'validatorjs';

import {store} from './Map';


const plugins = { dvr: validatorjs };

const fields = ['id', 'name', 'topLevel'];


class FormHandler extends MobxReactForm {

  onSuccess(form) {
    console.log('Form Values!', form.values());
    store.updateFeatureProps(form.values().id, toGeoJsonProps(form.values()))
  }

  onError(form) {
    // get all form errors
    console.log('All form errors', form.errors());
    // invalidate the form with a custom error message
    form.invalidate('This is a generic error message!');
  }
}


const FormWidget = observer(({ form, closeFn }) => (
    <form>
        <FormGroup controlId={form.$('name').id}  validationState={form.$('name').isValid ? 'success' : 'error'}>
            <ControlLabel>{form.$('name').label}</ControlLabel>
            <FormControl {...form.$('name').bind()} />
            <FormControl.Feedback />
            <HelpBlock>{form.$('name').error}</HelpBlock>
        </FormGroup>    

        <FormGroup controlId={form.$('topLevel').id}  validationState={form.$('topLevel').isValid ? 'success' : 'error'}>
            <ControlLabel>{form.$('topLevel').label}</ControlLabel>
            <Checkbox {...form.$('topLevel').bind()} checked={form.$('topLevel').value}>Check box if this boundary defines the climbing area
            </Checkbox>
            <FormControl.Feedback />
        </FormGroup>

        <ButtonToolbar>
            <Button 
                bsStyle="success"
                type="submit" 
                disabled={ form.isValid ? false : true } 
                onClick={form.onSubmit}><FontAwesome name='floppy-o'/>&nbsp;Save</Button>
           
            <Button 
                type="reset" 
                onClick={form.onClear}><FontAwesome name='undo'/>&nbsp;Reset</Button>

            <Button 
                type="button" 
                onClick={closeFn}><FontAwesome name='times'/>&nbsp;Close</Button>
        </ButtonToolbar>

    </form>
));


export default class BoundaryForm extends Component {
    render() {
        const values = loadGeoJsonPropsFromStore(this.props.targetId);
        const formHandler = new FormHandler({ fields, values }, { plugins });
        return (
            <FormWidget form={ formHandler } closeFn={this.props.closeFn}/>
        );
    }
}


function toGeoJsonProps(values) {
    const props = {};
    props.name = values.name;
    props.topLevel = values.topLevel;
    return props;
} 


function loadGeoJsonPropsFromStore(id) {
    const feature = store.getFeature(id);
    console.log("loading id->feature ", id, feature);
    if (feature !== null) {
        const props = feature.props;
        if (props !== null) {
            return {
                id: id,
                name: props.name,
                topLevel: props.topLevel,
            }
        }
    } 
    return {
        id: id,
        name: "",
        topLevel: false,
    }
}