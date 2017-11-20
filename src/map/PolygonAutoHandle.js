import React, { Component } from 'react';
import { LayerGroup, FeatureGroup, CircleMarker, Popup } from 'react-leaflet';
import { observer } from 'mobx-react';

import { drawingBuffer } from '../model/DrawingModel';


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
    radius={15} >
        <Popup>
            <span>
                <p>Area name: Some name...</p>
                <p><button name="select">Select</button></p>
            </span>
        </Popup>
</CircleMarker>
)