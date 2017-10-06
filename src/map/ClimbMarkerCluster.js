import React from 'react';
import L from 'leaflet';
import {LayerGroup, Marker, Tooltip} from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import {observer} from 'mobx-react';

import {store} from './../DataStore';
import ClimbDetail from '../detail-views/ClimbDetail';

const ClimbMarkerCluster = observer(
    () => {
        console.log('ClimbClusters:render() ', store.routeData);
        if (store.routeData === undefined || store.routeData.length < 1) {
            return <LayerGroup />;
        }

        const jsonData = store.routeData.slice();      
  
        const markers = jsonData.map(geojsonPoint2Marker);

        console.log('markers ', markers)
        return (
                <LayerGroup>
                    <MarkerClusterGroup
                        markers={markers}
                        onMarkerClick={onMarkerClickHandler}
                        wrapperOptions={{enableDefaultStyle: true}} 
                        options={markerclusterOptions}
                    >
                    </MarkerClusterGroup>
                </LayerGroup>
                );
    }
);


const onMarkerClickHandler = (marker) => {
    store.uiState.showSidebar({type: ClimbDetail, props: {index: marker.options.dataIndex}});    
}


/**
 * Convert a Point geojson to MarkerClusterGroup Marker
 * @param {feature} geojson feature with Point geometry 
 */
const geojsonPoint2Marker = (feature, index) => {
    const customIcon = makeIconFor(feature);
    var grade;
    if (feature.properties.grade !== undefined) {
        grade = feature.properties.grade.value;
    } else {
        grade = grade_hack(feature.properties.tags).map(item =>'<p>' + JSON.stringify(item) + '</p>');
    }

    const tooltipTxt = `Name: ${feature.properties.name}  ${grade}`;
    return {
        lat: feature.geometry.coordinates[1],
        lng: feature.geometry.coordinates[0],
        tooltip: tooltipTxt,
        options: {icon: customIcon, dataIndex: index},
    };
} 


// TODO: create custom icon based on the type of climb
function makeIconFor(geoJsonFeature) {
    return new L.DivIcon({
            html: '', 
            className: 'custom-marker-icon', 
            iconSize: [30, 30]});
}


const markerclusterOptions = {
    showCoverageOnHover: false,
   // spiderfyDistanceMultiplier: 1,

    // Setting custom icon for cluster group
    // https://github.com/Leaflet/Leaflet.markercluster#customising-the-clustered-markers
    iconCreateFunction: (cluster) => {
      return new L.DivIcon({
        html: `<span>${cluster.getChildCount()}</span>`,
        className: 'custom-cluster-icon',
        iconSize: new L.Point(40, 40, true)
      });
    },
};


function grade_hack(tags) {
    const regex = /^climbing:grade:.*$/;
    const results = [];
    for (var property in tags) {
        if (regex.test(property)) {
            results.push({[property]: tags[property]});
        }
    }
    return results;
}


function url_hack(name, tags) {
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
    //return '<a href="' + url + '" target="_new">' + name + '</a>';
    return name;
}

export default ClimbMarkerCluster;