import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {FormGroup, ControlLabel, FormControl, HelpBlock, Button, ButtonToolbar, Checkbox} from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import StepZilla from 'StepZilla';

const steps =
    [
      {name: 'Step 1', component: <Step1 />},
      {name: 'Step 2', component: <Step2 />},
      {name: 'Step 3', component: <Step3 />},
      {name: 'Step 4', component: <Step4 />},
      {name: 'Step 5', component: <Step5 />}
    ]

const AreaEntryForm = observer(
    class AreaEntryForm extends Component {


    }
);



const emptyEntry = {
    id: 0,
    name: "",
    topLevel: false
}


function loadGeoJsonPropsFromStore(id) {
    if (id === undefined) {
        return emptyEntry;
    }
    const feature = store.wip.map.get(id);
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