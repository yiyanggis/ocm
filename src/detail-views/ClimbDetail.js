import React, { Component } from 'react';
import { Item } from 'semantic-ui-react';
import {observer} from 'mobx-react';

import {store} from '../DataStore';
import {flattenGeojson} from '../detail-views/Utils';



const ClimbDetail = observer(
class ClimbDetail extends Component {

    render() {
        const index = this.props.index;
        console.log('ClimbDetail: ', index);
        if (store.routeData === undefined || store.routeData.length < 1) {
            return null;
        }
        const data = flattenGeojson(store.routeData[index]);
        return(
            <Item>
                <Item.Content>
                    <Item.Header>{data.name}</Item.Header>
                    <Item.Meta>Description</Item.Meta>
                    <Item.Description>
                    </Item.Description>
                </Item.Content>
            </Item>    
        );
    }
});

export default ClimbDetail;