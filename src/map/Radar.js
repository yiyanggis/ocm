import React from 'react';

import {Circle, FeatureGroup} from 'react-leaflet';


const Radar = (props) => (
    <FeatureGroup>
        <Circle
            center={props.center} 
            color='white' 
            weight='3'
            fillColor='red' 
            fillOpacity='1' 
            radius={15} >
        </Circle>
        <Circle
            className="radar-ring"
            center={props.center} 
            color={props.zoomLevel >  10 ? 'salmon' : 'white'} 
            weight='5'
            fillOpacity={props.zoomLevel >  10 ? '0' : '0.4'} 
            fillColor='#c6ffb3' 
            radius={props.radius} >
        </Circle>
    </FeatureGroup>        
);

export default Radar;