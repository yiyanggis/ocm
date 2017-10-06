import React, { Component } from 'react';
import { Item } from 'semantic-ui-react';

import {store} from '../DataStore';
import {flattenGeojson} from '../detail-views/Utils';


class OSMDetail extends Component {

    render() {
        const dataIndex = this.props.dataIndex;
        console.log('OSMDetail: ', dataIndex);
        if (dataIndex === undefined || store.osmData === undefined || store.osmData.length < 1) {
            return null;
        }
        const geojsonFeature = store.osmData[dataIndex];
        const data = flattenGeojson(geojsonFeature);
        console.log('OSMDetail ', data);
        return(
            <Item>
                <Item.Content>
                    <Item.Header>{data.name}</Item.Header>
                    <Item.Meta>Description</Item.Meta>
                    <Item.Description>
                    </Item.Description>
                    <Item.Extra as='a'  >Edit in OpenStreetMap (TBD)</Item.Extra>
                </Item.Content>
            </Item>    
        );
    }
}

export default OSMDetail;