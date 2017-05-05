import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { LayerGroup, CircleMarker, Popup } from 'react-leaflet';
import { Button } from 'react-bootstrap';

import {store} from '../DataStore';
import { lngLatFlip } from '../Utils';

// As the user draws a new area (polygon) on the map
// this function reacts to new polygon in WIP queue
// and creates a clickable circle aka 'handle' for that area 
// TODO: we need to consolidate it with BoundaryHandleLayer2 
const AreaHandleManager = observer(class AreaHandleManager extends Component {

    constructor(props) {
        super(props);
    }

    clickHandler = (layerId) => {
        if (this.featureGroupRef.leafletElement._map) {
            this.featureGroupRef.leafletElement._map.closePopup();
            console.log(this.featureGroupRef);
            this.featureGroupRef.leafletElement.setZIndex(4000);
        }
        console.log('Boundary handler clicked ', layerId);
        store.uiState.wantOpenBoundaryTextEditor(layerId);
    }


    render() {
        const polygons = store.wip.entries().filter(entry => entry[1].geometry.type === 'Polygon');
        console.log("BoundaryHandleLayer ", polygons);
        return (
            <LayerGroup ref={(ref)=>this.featureGroupRef=ref} >
                {   
                  polygons.map(entry =>
                   <AreaClickableHandle key={entry[0]} layerId={entry[0]} 
                        latlng={entry[1].geometry.coordinates[0][0]} >
                        
                        <PopupContent layerId={entry[0]} onClick={this.clickHandler.bind(this, entry[0])}/>
                    </AreaClickableHandle>)
                }
            </LayerGroup>
            );
    }
});


const AreaClickableHandle = (props) => (
    <CircleMarker
        center={lngLatFlip(props.latlng)}
        color='white' 
        weight='3'
        fillColor='#a9cce3' 
        fillOpacity='1' 
        radius={15} >
        {props.children}
    </CircleMarker>

);


const PopupContent = observer((props) => {
    console.log(props);
    const feature = store.wip.get(props.layerId);

    var name;
    if (feature.properties.name) {
        name = feature.properties.name;
    } else {
        name = "Not defined";
    }
    return (
        <Popup>
            <span>
                Area name: <b>{name}</b> <Button bsStyle="link" onClick={props.onClick}>Edit</Button>
            </span>
        </Popup>);
});





export {
    AreaClickableHandle,
    AreaHandleManager
}