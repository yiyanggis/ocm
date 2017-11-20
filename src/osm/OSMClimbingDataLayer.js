import React, {Component} from 'react';
import {LayerGroup, CircleMarker, Tooltip} from 'react-leaflet';
import {observer} from 'mobx-react';

import {store} from './../DataStore';
import {flattenGeojson} from '../sidebar/Utils';
import OSMDetailView from '../sidebar/OSMDetailView';
import {fsm, UIEvent} from '../model/UIState';


const OSMClimbingDataLayer = observer(() => {
    if (store.osmData === undefined || store.osmData.length < 1) {
        return (<LayerGroup/>);
    }

    const jsonData = store.osmData.slice();
   
    console.log("osm json: ", jsonData);

    return <OSMWorkerComponent geojson={jsonData} />
});


class OSMWorkerComponent extends Component {

    markerOnClick = (index) => {
        const event = new UIEvent({VIEW: OSMDetailView, visible: true, props: {dataIndex: index}});
        fsm.showDetailOnSidebar(event);
    }

    render() {
        const geojson = this.props.geojson;
        if (geojson === undefined || geojson.length < 1) {
            return <LayerGroup/>;
        }
        const dataLayer = geojson.map(
            (feature, index) => {
                const latlng = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];
                const data = flattenGeojson(feature);
                console.log('OSMWorkerComponent ', data);
                return (
                        <CircleMarker key={index} center={latlng}  color='#33ccff' weight='5' radius={20} 
                                    onClick={()=>this.markerOnClick(index)}>
                            <Tooltip>
                                <span>
                                Name: {data.name}<br/>
                                OSM Type: {data.osmType}<br/>
                                OSM Relation: {data.rels.join(',')}
                                </span>
                            </Tooltip>
                        </CircleMarker>
                    );
            }
        );
        console.log('osmDataLayer ', dataLayer);
        return (
            <LayerGroup>
                <div>
                    {dataLayer}
                </div>
            </LayerGroup>
        )
    }
}

export default OSMClimbingDataLayer;