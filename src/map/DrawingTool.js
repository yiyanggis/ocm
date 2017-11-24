import React from 'react';
import { EditControl } from "react-leaflet-draw";
import { FeatureGroup } from 'react-leaflet';

import { drawingBuffer } from '../model/DrawingModel'; 
import { fsm } from '../model/UIState';


const DrawingTool = () => {
    return (
        <FeatureGroup>
            <EditControl
                position='topright'
                onEdited={ _onEdited }
                onCreated={_onCreate}
                onDeleted={_onDeleted}
                onDeleteStop={_onDeleteStop}
                draw={{
                    rectangle: false,
                    circle: false,
                    polygon: {
                    shapeOptions: {
                        color: '#8B4513',
                        weight: 2,
                        fillColor: '#778899',
                        fillOpacity: 0.08,
                        clickable: false,
                        lineJoin: 'round'
                        }
                    }
                }}
            />
        </FeatureGroup> 
    );
}

export default DrawingTool;


const _onCreate = (e) => {
    console.log('Layer type: ', e.layerType);
    console.log("Layer: ", e.layer);
    const type = e.layerType;
    switch (type) {
        case 'marker':
            drawingBuffer.addObject(e.layer, 'marker');
            break;
        case 'polygon':
            console.log("New polygon: ", e.layer);
            drawingBuffer.addObject(e.layer, 'polygon');
            break;
        default:
            console.log("Layer type not supported: " + type);
    }
}


const _onDeleteStop = (e) => {
    console.log('_onDeleteStop ', e);
}


const _onDeleted = (e) => {
    console.log('_onDeleted ', e);
    e.layers.eachLayer((l) => {
            console.log('layer ', l);
            drawingBuffer.deleteObject(l._leaflet_id);
            });
    fsm.hideSidebar();
}


const _onEdited = e => {
    console.log('_onEdited ', e);
    const layer = e.target;
    e.layers.eachLayer(
        layer => {
            console.log('Edited layer: ', layer);
            const id = layer._leaflet_id;
            const obj = drawingBuffer.data.get(id);
            drawingBuffer.deleteObject(id);
            drawingBuffer.addObject(obj.layer, obj.type);
        }
    );

}