import React from 'react';
import {Card, Icon, Header, Button} from 'semantic-ui-react';

import {fsm} from '../model/UIState';
import {store} from '../DataStore';
import {flattenGeojson} from './Utils';
import {activateAreaEditFn} from '../model/EventTransformer';

const AreaDetailView = ({dataIndex}) => {
    console.log('AreaDetailView: ', dataIndex);        
    if (dataIndex === undefined || store.routeData === undefined || store.routeData.length < 1) {
        return null;
    }
    const geojson = store.boundaryData[dataIndex];
    const data = flattenGeojson(geojson);
    return (
        <Card fluid raised color='brown'>
            <Card.Content>
                <Card.Header>
                    <Header as='h3'>{data.name || "<Name undefined>"} Area</Header>
                </Card.Header>
                <Card.Meta>
                    <Icon name='object group' />
                </Card.Meta>
                <Card.Description>
                    Some content
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Button.Group basic>
                    <Button compact basic secondary icon='empty heart' onClick={()=>alert('TBD')} content='Like' />
                    <Button compact basic secondary icon='share' onClick={()=>alert('TBD')} content='Share' />
                </Button.Group>
                <Button compact basic positive icon='edit' floated='right' onClick={ ()=> switchToEditMode(dataIndex) } content='Improve this entry' />
            </Card.Content>
        </Card>        
    );
}

export default AreaDetailView;

const switchToEditMode = (dataIndex) => {
    fsm.showDetailOnSidebar(activateAreaEditFn(dataIndex));
}