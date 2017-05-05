import React, { Component } from 'react';
import {Map, Polygon, FeatureGroup, CircleMarker} from 'react-leaflet';
import { EditControl } from "react-leaflet-draw";
import {divIcon} from 'leaflet';
import {observer} from 'mobx-react';


const MapEditTool = component(
    class LeafletDraw extends Component {

        constructor(props) {
            super(props);
            this.state = {
                circle: false,
                rectangle: false,
                polygon: false,
                marker: false
            }
        }


        render() {
            return (
                <FeatureGroup>
                    <EditControl
                      position='topleft'
                      onEdited={this._onEditPath}
                      onCreated={this._onCreate}
                      onDeleted={this._onDeleted}
                      draw={{
                        rectangle: this.state.rectangle,
                        circle: this.state.circle,
                        polygon: this.state.polygon,
                        market: this.state.marker
                      }}
                    />
                </FeatureGroup>
            );
        }

        turnControlsOn = ({rectangle, circle, polygon, marker}) => ({
                this.setState({
                    rectangle: rectangle ? rectangle : this.state.rectangle, 
                    circle: circle ? circle : this.state.circle, 
                    polygon: polygon ? polygon : this.state.polygon,
                    marker: marker ? marker : this.state.marker,
                });
            }
        });

        turnMarkerOn = () => ({
            this.setState({
                marker: markerOptions    
            });
        });
    }
);


const polygonOptions = {
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