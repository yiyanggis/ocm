import React, { Component } from 'react'

import MainMap from './Map'
import SearchBar from './SearchBar'
import SidebarContainer from './SidebarContainer'

import {store} from './DataStore'
import {uiState} from './model/UIState'
import TopNav from './TopNav'

const turfBuffer = require('@turf/buffer');
const turfHelpers = require('@turf/helpers');
const turfBbox = require('@turf/bbox');


const makeBBox = (center, radius) => {
    const f = turfHelpers.point(center);
    const b = turfBuffer(f, radius, 'meters');
    return turfBbox(b);
}


const bboxFlip = (bbox) => ([[bbox[1], bbox[0]],
                             [bbox[3], bbox[2]]]);

const lngLatFlip = (center) => ([center[1], center[0]]);
 

/*
* ####################################
* ## This is where the app begins ! ##
* ####################################
*/
export default class ReactApp extends Component {

    constructor(props) {
        super(props);
        const initialCenter = [8.67972,50.11361]; //TODO: get center from browser's geolocation
        this.state = {
            center: initialCenter,
            bbox: makeBBox(initialCenter, 200000),
            radius: 200000,
            zoom: 2,
            routeData: {features: []},
            boundaryData: {features: []},
            error:{
                code: 200,
                msg: ''
            },
            unit: 'metric',
            located: false
        }
        this.mapRef = null;
    }

    componentDidMount = () => {
        if ("geolocation" in navigator) {
             navigator.geolocation.getCurrentPosition(({coords}) => {
                this.setState(() => ({located: true}))
                this.updateMapCenter({geocode: {center: [parseFloat(coords.longitude), parseFloat(coords.latitude)]}, radius: 50000})
            });
        }
        this.forceUpdate();  // this is a hack to get 'mapRef' set to non-null
    }



    updateMapCenter = ({geocode, radius}) => {
        console.log('Map filters:', geocode, radius);
        const bbox = makeBBox(geocode.center, radius);
        store.loadFromBackend({center: geocode.center, radius: radius});
        this.setState({
            center: geocode.center,
            bbox: bbox,
            radius: radius
        });
    }


    render() {
        // Important: Leaflet expects [Lat,Lng] 
        // so we need to reverse [x,y] of center and bbox 
        // before passing them to MainMap.
        // Other components that accept Geojson will need to handle
        // the flipping as needed.
        const {center, bbox, ...theRest} = this.state;
        const MainMapComp = (<MainMap   center={lngLatFlip(center)} 
                                    bbox={bboxFlip(bbox)} 
                                    {...theRest} 
                                    ref={(mainMap)=>{this.mapRef = mainMap}}
                                    uiState={uiState}
                                    />);
        
        return (
            <div>
                <SidebarContainer uiState={uiState} mainContent={MainMapComp}/>
                <TopNav lightactive={true} mapRef={this.mapRef}>
                    <SearchBar initialSearch="" updateMapCenter={this.updateMapCenter}/>
                </TopNav>
            </div>
    );} // render()
}