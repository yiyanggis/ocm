import React, { Component } from 'react';
import {Map, TileLayer, LayersControl, ZoomControl, ScaleControl, LayerGroup, Polygon, FeatureGroup, CircleMarker, Popup} from 'react-leaflet';
import {observer} from 'mobx-react';

import Radar from './map/Radar';
import PolygonAutoHandle from './map/PolygonAutoHandle';
import DrawingTool from './map/DrawingTool';
import {store} from './DataStore';
import { drawingBuffer } from './model/DrawingModel';
import OSMClimbingDataLayer from './osm/OSMClimbingDataLayer';
import ClimbMarkerCluster from './map/ClimbMarkerCluster';


const mapboxAttribution = 'Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>';


// store.registerMarkerHandler((change) => {
//     const action = change.type;
//     console.log('Store observer ', action);
//     switch (action) {
//         case 'add':
//             const layer = change.newValue.layer;
//             if (change.newValue.type ==='marker') {
//                 layer.on('click', function(e) {
//                     // TODO: when in "interactive delete mode" (by clicking the Trash bin icon)
//                     // we don't want to activate the popup dialog
//                     //store.setUIState({event: UIState.ROUTE_TEXT_EDIT_INITIATED, target: layer._leaflet_id});
//                     store.uiState.wantOpenRouteTextEditor(layer._leaflet_id);
//                     console.log("marker clicked");
//                 });
//             } else if (change.newValue.type === 'polygon') {

//             }
//             break;

//         case 'delete':
//             console.log('Old value ', change.oldValue);
//             break;

//         default:
//             console.log('Action unknown: ', action);
//     }
// });






//const mapboxUrl = "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoidmlldGdvZXN3ZXN0IiwiYSI6ImNpbzljZnVwNTAzM2x2d2x6OTRpb3JjMmQifQ.rcxOnDEeY4McXKDamMLOlA";

const mapboxUrl = "https://api.mapbox.com/styles/v1/vietgoeswest/cj90fz6uzjs952rpqij9z4m75/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoidmlldGdvZXN3ZXN0IiwiYSI6ImNpbzljZnVwNTAzM2x2d2x6OTRpb3JjMmQifQ.rcxOnDEeY4McXKDamMLOlA";

const defaultMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8,
    zIndexOffset: 1000  
};

function url_hack2(name, tags) {
    if (tags === undefined) {
        return name;
    }
    var url;
    if (tags.website !== undefined) {
        url = tags.website;
    } else if (tags.url !== undefined) {
        url = tags.url;
    } else {
        return name;
    }
    return <a href={url} target='_new'>{name}</a>;
}

class GeoJSONLayer extends Component {

    render() {
        return null;  //temporarily disable polygon data
        console.log('GeoJSONLayer.render()', this.props.data);
        if (this.props.data.features === undefined) {
            return <LayerGroup/>;
        }

        if (this.props.data.features.length < 1) {
            return <LayerGroup/>;
        }
        
        var keyId = -1;
        const polygons = this.props.data.features.map(
            function(feature) {
                keyId++;
                const coordinates = feature.geometry.coordinates[0];
                const pts = coordinates.map(p => [p[1], p[0]]);
                console.log("drawing area polygon: ", feature.properties, pts);
                return (<FeatureGroup key={keyId}>
                            <Polygon color='purple' positions={pts} />
                            <BoundaryHandleLayer2  coordinates={pts} properties={feature.properties} />
                        </FeatureGroup>
                        );
            }
        );
        console.log("polygons: ", polygons );
       return(<FeatureGroup>{polygons}</FeatureGroup>);        
    }
}


const BoundaryHandleLayer2 = class BoundaryHandleLayer extends Component {

    render() {
        const popupContent = url_hack2(this.props.properties.name, this.props.properties.tags);
        return (<BoundaryHandler 
                    key={this.props.keyId}
                    latlng={this.props.coordinates[0]}
                    popupContent={popupContent} />);
    }
}


//TODO: this handler is used by the drawing logic 
// we need to consolidate it iwth BoundaryHandleLayer2 
const BoundaryHandleLayer = observer(class BoundaryHandleLayer extends Component {

    constructor(props) {
        super(props);
        this.leafletMap = null
        this.clickHandler = this.clickHandler.bind(this);
    }


    clickHandler(layerId) {
        console.log('Boundary handler clicked ', layerId);
        store.uiState.wantOpenBoundaryTextEditor(layerId);
    }


    render() {
        const polygons = store.store.values().filter(v => v.type === 'polygon');
        console.log("BoundaryHandleLayer ", polygons);
        if (polygons.length === 0) {
            return null;
        }
        return (
            <LayerGroup>
                <div>
                {   
                  polygons.map(v =>
                   <BoundaryHandler 
                        key={v.layer._leaflet_id} 
                        latlng={v.layer._latlngs[0][0]}
                        clickHandler={this.clickHandler.bind(this, v.layer._leaflet_id)}/>)
                }
                </div>
            </LayerGroup>
            );
    }
});


const BoundaryHandler = (props) => (
    <CircleMarker
        center={props.latlng} 
        color='white' 
        weight='3'
        fillColor='#a9cce3' 
        fillOpacity='1' 
        radius={15} >
            <Popup>
                <span>
                    <p>Area name: {props.popupContent}</p>
                    <p><button name="select">Select</button></p>
                </span>
            </Popup>
    </CircleMarker>

);




export default class MainMap extends Component {

    constructor(props) {
        super(props);

        this.state = {
          lat: 37.0902,
          lng: -95.7129,
          zoom: 3,
          routeData: [],
          boundaryData: [1],
          leafletRef: null
        };
    }


    getMarkerStyle(feature, layer) {
        return defaultMarkerOptions;
    }


    componentDidMount() {
        console.log("### ref: ", this.leafletRef);
        this.setState({
            leafletRef: this.leafletRef.leafletElement
        });
    }

    getBBox = () => {
        const bboxLatLng = this.state.leafletRef.getBounds();
        return [bboxLatLng.getSouth(), bboxLatLng.getWest(), bboxLatLng.getNorth(), bboxLatLng.getEast()];
    }

    getCurrentZoomLevel = () => {
        return this.state.leafletRef.getZoom();
    }

    render() {
        return (
            <Map 
                style={{height:'90%', minHeight: '90vh', width: '100%', position: 'float', marginTop: '5em'}} 
                center={this.props.center}
                bounds={this.props.bbox}
                zoom={this.state.zoom} 
                zoomControl={false}
                maxZoom={23}
                onZoomEnd={(e) =>
                    this.setState({zoom: e.target._zoom})} 
                ref={ref=>this.leafletRef=ref}>

                <ZoomControl position='bottomright' />
                <ScaleControl position='bottomleft'/>
                <LayersControl position='topright'>
                    <LayersControl.BaseLayer name='Satellite'>
                        <TileLayer
                          attribution={mapboxAttribution}
                          url={mapboxUrl}
                          id='mapbox.satellite'
                          maxZoom='23'
                          />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name='Outdoors'>
                        <TileLayer
                          attribution={mapboxAttribution}
                          url={mapboxUrl}
                          id='mapbox.outdoors'
                          maxZoom='23'/>
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer checked name='Light'>
                        <TileLayer
                          attribution={mapboxAttribution}
                          url='https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoidmlldGdvZXN3ZXN0IiwiYSI6ImNpbzljZnVwNTAzM2x2d2x6OTRpb3JjMmQifQ.rcxOnDEeY4McXKDamMLOlA'
                          id='mapbox.light'
                          maxZoom='23'/>
                    </LayersControl.BaseLayer>

                    <Radar zoomLevel={this.state.zoom} center={this.props.center} radius={this.props.radius} />         
                
                    <LayersControl.Overlay checked name='Routes'>
                        <ClimbMarkerCluster />
                    </LayersControl.Overlay>
                    <LayersControl.Overlay checked name='Areas'>
                        <GeoJSONLayer data={this.props.boundaryData} />
                    </LayersControl.Overlay>
                    <LayersControl.Overlay checked name='OSM data'>
                        <OSMClimbingDataLayer uiState={this.props.uiState}/>
                    </LayersControl.Overlay>
                    <LayersControl.Overlay checked name='Your edits'>
                        <LayerGroup>
                            <DrawingTool observableUIState={this.props.uiState.states} />
                            <PolygonAutoHandle data={ drawingBuffer.data } />
                        </LayerGroup>
                    </LayersControl.Overlay>
                </LayersControl>

              </Map>
            );
    } //render
};