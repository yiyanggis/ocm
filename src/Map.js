import React, { Component } from 'react';
import { Map, TileLayer, LayersControl, ZoomControl, ScaleControl, LayerGroup} from 'react-leaflet';

import Radar from './map/Radar';
import PolygonAutoHandle from './map/PolygonAutoHandle';
import DrawingTool from './map/DrawingTool';
import { drawingBuffer } from './model/DrawingModel';
import OSMClimbingDataLayer from './osm/OSMClimbingDataLayer';
import ClimbMarkerCluster from './map/ClimbMarkerCluster';
import BoundaryLayer from './map/BoundaryLayer';


const mapboxAttribution = 'Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>';

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
                maxZoom={25}
                onZoomEnd={(e) =>
                    this.setState({zoom: e.target._zoom})} 
                ref={ref=>this.leafletRef=ref}>

                <ZoomControl position='bottomright' />
                <ScaleControl position='bottomleft'/>
                <LayersControl position='topright'>
                    <LayersControl.BaseLayer id="satelliteLayer" name='Satellite'>
                        <TileLayer
                          attribution={mapboxAttribution}
                          url={mapboxUrl}
                          id='mapbox.satellite'
                          maxZoom='25'
                          ref={ref=>this.satelliteLayer=ref}
                          />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name='Night'>
                        <TileLayer
                          attribution={mapboxAttribution}
                          url={mapboxUrl}
                          id='mapbox.dark'
                          maxZoom='25'                          
                          ref={ref=>this.nightLayer=ref}
                          />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name='Outdoors'>
                        <TileLayer
                          attribution={mapboxAttribution}
                          url={mapboxUrl}
                          id='mapbox.outdoors'
                          maxZoom='25'                          
                          ref={ref=>this.outdoorsLayer=ref}
                          />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer checked name='Light'>
                        <TileLayer
                          attribution={mapboxAttribution}
                          url={mapboxUrl}
                          id='mapbox.light'
                          maxZoom='25'                          
                          ref={ref=>this.lightLayer=ref}
                          />
                    </LayersControl.BaseLayer>

                    <Radar zoomLevel={this.state.zoom} center={this.props.center} radius={this.props.radius} />         
                
                    <LayersControl.Overlay checked name='Routes'>
                        <ClimbMarkerCluster />
                    </LayersControl.Overlay>
                    <LayersControl.Overlay checked name='Areas'>
                        <BoundaryLayer />
                    </LayersControl.Overlay>
                    <LayersControl.Overlay checked name='OSM data'>
                        <OSMClimbingDataLayer uiState={this.props.uiState}/>
                    </LayersControl.Overlay>
                    <LayersControl.Overlay checked name='Your edits'>
                        <LayerGroup>
                            <DrawingTool observableUIState={this.props.uiState.states}/>
                            <PolygonAutoHandle data={ drawingBuffer.data } dataFn={ drawingBuffer.polygonsFn } />
                        </LayerGroup>
                    </LayersControl.Overlay>
                </LayersControl>

              </Map>
            );
    } //render
};