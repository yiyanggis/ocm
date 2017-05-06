import React, { Component } from 'react';
import {Map, FeatureGroup, CircleMarker} from 'react-leaflet';
import { EditControl} from "react-leaflet-draw";
import L from 'leaflet';
import Draw from 'leaflet-draw';
import {divIcon,} from 'leaflet';
import {observer} from 'mobx-react';

import {store} from '../DataStore';


const polygonOptions = {
    allowIntersection: false,
    showArea: true,
    shapeOptions: {
        color: '#8B4513',
        weight: 2,
        fillColor: '#778899',
        fillOpacity: 0.08,
        clickable: false,
        lineJoin: 'round'
    }
}


const markerOptions = {
    icon: divIcon({
            html: '', 
            className: 'custom-marker-icon', 
            iconSize: [30, 30]})
}


const MapEditTool = observer(
    class MapEditTool extends Component {

        render() {
            return (
                <FeatureGroup ref={ref=>this.featureGroupRef=ref}>
                    <LeafletDraw/>
                </FeatureGroup>
            );
        }
    }
);


const LeafletDraw = observer(class LeafletDraw extends Component {
        // Automatically activate Edit mode
    setupPolygon(ref) {
       if (ref) {
           const polygon = new L.Draw.Polygon(ref.leafletElement._map, polygonOptions);
            polygon.enable();
        }
    }

    render() {
        if (!store.uiState.shouldEnableBoundaryEditMode.get() && true) {
            return null;
        }

        return (
            <EditControl ref={ref=>this.setupPolygon(ref)}
              position='topleft'
              onEdited={this._onEditPath}
              onCreated={_onCreated}
              onDeleted={_onDeleted}
              edit={true}
              draw={{
                rectangle: false,
                circle: false,
                polygon: polygonOptions,
                marker: false,
                polyline: false,
              }}
            />
            ); 
    }
});


function _onCreated(e) {
    console.log('Layer type: ', e.layerType);
    console.log("Layer: ", e.layer);
    const type = e.layerType;
    switch (type) {
        case 'marker':
            store.addObject(e.layer, 'marker');
            break;
        case 'polygon':
            console.log("New polygon: ", e.layer);
            e.layer.bringToBack();
            e.layer.interactive=false;
            const feature = e.layer.toGeoJSON();
            console.log(feature);
            store.wip.updateOrAdd(e.layer._leaflet_id, feature);
            break;
        default:
            console.log("Layer type not supported: " + type);
    }
}


function _onDeleted(e) {
    e.layers.eachLayer((layer) => {
            store.wip.remove(layer._leaflet_id);
            });
    console.log('wip ', store.wip.map.entries());
}


export default MapEditTool;