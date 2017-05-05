import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {FormGroup, ControlLabel, FormControl, HelpBlock, Button, ButtonToolbar, Checkbox} from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import MobxReactForm from 'mobx-react-form';
import validatorjs from 'validatorjs';
import turfHelpers from '@turf/helpers';


import {store} from './DataStore';


const plugins = { dvr: validatorjs };

const fields = ['id', 'name', 'topLevel'];

const rules = {
  name: 'required|string|between:2,50'
}


class FormHandler extends MobxReactForm {

    onSuccess(form) {
        console.log('Form Values!', form.values());
        const id=  store.wip.updateProperties(form.values().id, toGeoJsonProps(form.values()));
        if (form.values().id !== id) {
            form.$('id').set(id); 
        }
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
            <ControlLabel>Name</ControlLabel>
            <FormControl {...form.$('name').bind()} />
            <FormControl.Feedback />
            <HelpBlock>{form.$('name').error}</HelpBlock>
        </FormGroup>    

        <FormGroup controlId={form.$('topLevel').id}>
            <ControlLabel>Top Level?</ControlLabel>
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
        const values = loadGeoJsonPropsFromStore(this.props.itemId);
        const formHandler = new FormHandler({ fields, rules, values }, { plugins });
        return (
            <FormWidget form={ formHandler } closeFn={this.props.closeFn}/>
        );
    }
}


function toGeoJsonProps(values) {
    return {
        name: values.name,
        topLevel: values.topLevel
    }
} 


const emptyEntry = {
    id: 0,
    name: "",
    topLevel: false
}


function loadGeoJsonPropsFromStore(id) {
    if (id === undefined) {
        return emptyEntry;
    }
    const feature = store.wip.get(id);
    console.log("loading id->feature ", id, feature);

    if (feature !== undefined) {
        // Edit existing
        const properties = feature.properties;
        if (properties !== null) {
            return {
                id: id,
                name: properties.name,
                topLevel: properties.topLevel,
            }
        }
    } 
    // oops not found - go ahead and add new
    return emptyEntry;
}