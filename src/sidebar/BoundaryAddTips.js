import React from 'react';

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


const BoundaryAddTips = () => {
    return (
        <Card fluid>
            <Card.Content>
                <Card.Header>Tip - How to Add an Area</Card.Header>
                    <Card.Description>
                    Select the polygon drawing icon and start drawing
                    </Card.Description>
            </Card.Content>

        </Card>
    );
}
export default BoundaryAddTips  