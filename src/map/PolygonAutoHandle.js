import React, { Component } from 'react';
import { LayerGroup, FeatureGroup, CircleMarker, Popup } from 'react-leaflet';
import { observer } from 'mobx-react';
import { Button } from 'semantic-ui-react'

import {fsm, UIEvent} from '../model/UIState';
import { drawingBuffer } from '../model/DrawingModel';
import BoundaryEditView from '../sidebar/BoundaryEditView';


/**
 * Observe changes to user drawing data structure.  When a new polygon
 * is added create a clickable circle handle using one of the polygon nodes.
 */
const PolygonAutoHandle = observer(({data}) => {
    if (data === undefined) {
        return null;
    }
   console.log('PolygonAutoHandle ', data);
    const polygons = data.values().filter(v => v.type === 'polygon');
    console.log("PolygonAutoHandle ", polygons);
    if (polygons.length === 0) {
        return null;
    }
    return (
        <LayerGroup>
            <div>
            {   
                polygons.map(v =>
                   <ClickableHandle 
                        key={v.layer._leaflet_id} 
                        id={v.layer._leaflet_id}
                        latlng={v.layer._latlngs[0][0]}
                        />)
            }
            </div>
        </LayerGroup>
    );   
});

export default PolygonAutoHandle;


const ClickableHandle = ({id, latlng}) => (
    <CircleMarker
    center={latlng} 
    color='white' 
    weight='3'
    fillColor='#a9cce3' 
    fillOpacity='1' 
    radius={15} 
    onClick={()=>handleOnClick(id)}
    >
        {/* <Popup>
            <span>
                <p>Area name: Some name...</p>
                <p><Button>More...</Button></p>
            </span>
        </Popup> */}
</CircleMarker>
)

const handleOnClick = (layerId) => {
    const event = new UIEvent({VIEW: BoundaryEditView, visible: true, props: {layerId: layerId}});
    fsm.showDetailOnSidebar(event);
}