import React, { Component } from 'react';
import {marker, popup} from 'leaflet';
import { Map, TileLayer, LayersControl, ZoomControl, ScaleControl, GeoJSON, LayerGroup, Circle, FeatureGroup, CircleMarker} from 'react-leaflet';
import { EditControl } from "react-leaflet-draw";
import 'whatwg-fetch';
import {observer} from 'mobx-react';

import Backend from './Backend';


import {DataStore} from './DataStore';
import PropertiesEditor from './PropertiesEditor';

export const store = new DataStore();
window.store = store;

const osmAttribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>';
const mapboxAttribution = 'Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>';


store.registerMarkerHandler((change) => {
    const action = change.type;
    console.log('Store observer ', action);
    switch (action) {
        case 'add':
            const layer = change.newValue.layer;
            if (change.newValue.type ==='marker') {
                layer.on('click', function(e) {
                    // TODO: when in "interactive delete mode" (by clicking the Trash bin icon)
                    // we don't want to activate the popup dialog
                    //store.setUIState({event: UIState.ROUTE_TEXT_EDIT_INITIATED, target: layer._leaflet_id});
                    store.uiState.wantOpenRouteTextEditor(layer._leaflet_id);
                    console.log("marker clicked");
                });
            } else if (change.newValue.type === 'polygon') {

            }
            break;
        case 'delete':
            console.log('Old value ', change.oldValue);
            break;
    }

});






const mapboxUrl = "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoidmlldGdvZXN3ZXN0IiwiYSI6ImNpbzljZnVwNTAzM2x2d2x6OTRpb3JjMmQifQ.rcxOnDEeY4McXKDamMLOlA";

const defaultMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8,
    zIndexOffset: 1000  
};



class GeoJSONLayer extends Component {

    componentWillMount() {
       // const geojsonLayer = this.geojsonLayer;
      //  console.log(this.leafletElement);
    }

    render() {
        return(
            <GeoJSON 
                data={this.props.data}  
                ref={m => { this.geojsonLayer = m; }}
                pointToLayer={this.onPointToLayer}/>
        );
    }

    onPointToLayer(feature, latlng) {
        // customize icon here 
        const m = marker(latlng,{});
        const p = popup().setContent(`${feature.properties.name} ${feature.properties.grade.value}`);
        m.bindPopup(p);
        return m;
    }
}


const BoundaryHandleLayer = observer(class BoundaryHandleLayer extends Component {
    constructor(props) {
        super(props);
        this.clickHandler = this.clickHandler.bind(this);
    }


    clickHandler(layerId) {
        console.log('Boundary handler clicked ', layerId);
        store.uiState.wantOpenBoundaryTextEditor(layerId);
    }


    render() {
        const polygons = store.store.values().filter(v => v.type === 'polygon');
        console.log("BoundaryHandleLayer ", polygons);
        return (
            <LayerGroup>
                {   
                  polygons.map(v =>
                   <BoundaryHandler 
                        key={v.layer._leaflet_id} 
                        latlng={v.layer._latlngs[0][0]}
                        clickHandler={this.clickHandler.bind(this, v.layer._leaflet_id)}/>)
                }
            </LayerGroup>
            );
    }
});


const BoundaryHandler = (props) => (
    <CircleMarker
        center={props.latlng} 
        color='white' 
        weight='3'
        fillColor='orange' 
        fillOpacity='1' 
        radius={15} 
        onClick={props.clickHandler}/>
);


export default class MainMap extends Component {
    constructor() {
        super();
        this.state = {
          lat: 37.0902,
          lng: -95.7129,
          zoom: 3,
          data: {}
        };
    }

    getMarkerStyle(feature, layer) {
        return defaultMarkerOptions;
    }

    componentDidMount() {
        const leafletMap = this.leafletMap.leafletElement;
        const geojsonLayer = this.geojsonLayer;
        
        const opts = {center: [this.state.lat, this.state.lng], radius: 40000};
        var latlng = opts.center[1] + ',' + opts.center[0];
        var radius = opts.radius;
        const that = this;
        const backend = new Backend();
        const options = opts;
        backend.load(options, function(json){
                that.setState({data: json.route});
            }
            );
   }


    render() {
        const position = [this.state.lat, this.state.lng];
        const globalStore = store;
        console.log("global store: " + store);
        return (
            <div className="mapRoot">
            <PropertiesEditor store={globalStore}/>
            <Map 
                style={{height:'100%'}} 
                center={position} 
                zoom={this.state.zoom} 
                zoomControl={false}
                ref={m => { this.leafletMap = m; }}>

                <ZoomControl position='topleft' />
                <ScaleControl position='bottomleft'/>
                <LayersControl position='topleft'>
                    <LayersControl.BaseLayer name='OpenStreetMap'>
                        <TileLayer
                          attribution={osmAttribution}
                          url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'/>
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name='Outdoors'>
                        <TileLayer
                          attribution={mapboxAttribution}
                          url={mapboxUrl}
                          id='mapbox.outdoors'/>
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer checked name='Light'>
                        <TileLayer
                          attribution={mapboxAttribution}
                          url={mapboxUrl}
                          id='mapbox.light'/>
                    </LayersControl.BaseLayer>
                    <LayersControl.Overlay checked name='Routes'>
                        <LayerGroup>
                        {this.state.data.features !== undefined &&
                            <GeoJSONLayer data={this.state.data} />
                        }
                            <Circle center={[37.0902,-95.7129]} color='green' fillColor='green' radius={1000} />
                        </LayerGroup>
                    </LayersControl.Overlay>
                    <LayersControl.Overlay checked name='Your edits'>
                        <LayerGroup>
                            <FeatureGroup>
                                <EditControl
                                  position='topleft'
                                  onEdited={this._onEditPath}
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
                            <BoundaryHandleLayer />
                        </LayerGroup>
                    </LayersControl.Overlay>
                </LayersControl>

              </Map>
              </div>
            );
    } //render
};


function _onCreate(e) {
    console.log('Layer type: ', e.layerType);
    console.log("Layer: ", e.layer);
    const type = e.layerType;
    switch (type) {
        case 'marker':
            store.addObject(e.layer, 'marker');
            break;
        case 'polygon':
            console.log("New polygon: ", e.layer);
            store.addObject(e.layer, 'polygon');
            break;
        default:
            console.log("Layer type not supported: " + type);
    }
}

function _onDeleteStop(e) {
    console.log('_onDeleteStop ', e);
    console.log('store ', store.store.entries())
    //store.deleteObject(e.layer._leaflet_id);
}

function _onDeleted(e) {
    console.log('_onDeleted ', e);
    e.layers.eachLayer(function(l) {
            console.log('layer ', l);
            store.deleteObject(l._leaflet_id);
            });
    console.log('store ', store.store.entries())
}

function getGeoJson() {
    return {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "Point",
            "coordinates": [
                -95.7129,
                37.0902
              ]}
        }
        ]
    }
}
