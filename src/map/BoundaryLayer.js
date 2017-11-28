import React, { Component } from 'react';
import { LayerGroup, FeatureGroup, CircleMarker, Polygon } from 'react-leaflet';
import { observer } from 'mobx-react';

import {fsm, UIEvent} from '../model/UIState';
import { store } from '../DataStore';


const BoundaryLayer = observer(
class BoundaryLayer extends Component {
    
    render() {
        console.log('BoundaryLayer.render()', store.boundaryData);
        if (store.boundaryData === undefined || store.boundaryData.length < 1) {
            return <LayerGroup />;
        }
        
        const polygons = store.boundaryData.map(
            function(feature, dataIndex) {
                const coordinates = feature.geometry.coordinates[0];
                const pts = coordinates.map(p => [p[1], p[0]]);
                console.log("drawing area polygon: ", feature.properties, pts);
                return (<FeatureGroup key={dataIndex}>
                            <Polygon color='purple' positions={pts} />
                            <ClickableHandle dataIndex={ dataIndex } 
                                             latlng={ pts[0] }
                                             geojsonProps={feature.properties} />
                        </FeatureGroup>
                        );
            }
        );
        return(<LayerGroup><div>{polygons}</div></LayerGroup>);        
    }
})


const ClickableHandle = ({latlng, geojsonProps, dataIndex}) => (
    <CircleMarker
    center={latlng} 
    color='white' 
    weight='3'
    fillColor='#a9cce3' 
    fillOpacity='1' 
    radius={15} 
    onClick={()=>handleOnClick(dataIndex)}
    >
        {/* <Popup>
            <span>
                <p>Area name: Some name...</p>
                <p><Button>More...</Button></p>
            </span>
        </Popup> */}
</CircleMarker>
)

const handleOnClick = (dataIndex) => {
    fsm.showDetailOnSidebar(UIEvent.AreaDetailView({dataIndex: dataIndex}));
}

export default BoundaryLayer;