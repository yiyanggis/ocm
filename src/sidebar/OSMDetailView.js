import React from 'react';
import { 
    Grid,
    Card,
    Label,
    Icon,
    Table
 } from 'semantic-ui-react';
 
import {store} from '../DataStore';
import {flattenGeojson} from './Utils';

const OSMDetailView = ({dataIndex}) => {
    console.log('ClimbDetailView: ', dataIndex);            
    if (dataIndex === undefined || store.osmData === undefined || store.osmData.length < 1) {
        return null;
    }
    const geojson = store.osmData[dataIndex];
    const data = flattenGeojson(geojson);
    console.log('OSMDetail ', data);
    console.log('tags ', Object.entries(geojson.properties.tags));
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
                    Tags
                    <OSMTags2Table tagsArray={Object.entries(geojson.properties.tags)}/>
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


export default OSMDetailView;


const OSMTags2Table = ({tagsArray}) => (
    <Table striped compact>
        <Table.Header>
            <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Value</Table.HeaderCell>
            </Table.Row>
        </Table.Header>
      <Table.Body>
        {
            tagsArray.map( 
                (entry, index) => {
                    return (
                        <Table.Row key={index}>
                            <Table.Cell>{entry[0]}</Table.Cell>
                            <Table.Cell>{entry[1]}</Table.Cell>
                        </Table.Row>)
                 })
        }
        </Table.Body>
    </Table>
);

