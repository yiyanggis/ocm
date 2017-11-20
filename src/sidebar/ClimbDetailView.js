import React from 'react';
import {Card, Grid, Label, Icon} from 'semantic-ui-react';

import {store} from '../DataStore';
import {flattenGeojson} from './Utils';


const ClimbDetailView = ({dataIndex}) => {
    console.log('ClimbDetailView: ', dataIndex);        
    if (dataIndex === undefined || store.routeData === undefined || store.routeData.length < 1) {
        return null;
    }
    const geojson = store.routeData[dataIndex];
    const data = flattenGeojson(geojson);
    return (
        <Card fluid>
            <Card.Content>
                <Card.Header>
                    <Grid divided='vertically'>
                        <Grid.Row columns={2}>
                        <Grid.Column width={12}>
                            {data.name || "<Name undefined>"} 
                        </Grid.Column>
                        <Grid.Column width={4} textAlign='right'>
                            {data.props.grade && data.props.grade.value}
                        </Grid.Column>
                        </Grid.Row>
                    </Grid>                   
                </Card.Header>
                <Card.Meta>
                    <Icon name='marker' />
                    {geojson.geometry.coordinates[1]}, {geojson.geometry.coordinates[0]} 
                </Card.Meta>
                <Card.Description>
                    Some content
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Label basic onClick={()=>alert('TBD')}>
                    <Icon name='empty heart'/>Like
                </Label>
                <Label basic onClick={()=>alert('TBD')}>
                    <Icon name='share'/>Share
                </Label>
            </Card.Content>
        </Card>        
    );
}


export default ClimbDetailView;