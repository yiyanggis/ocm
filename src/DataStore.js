import {useStrict, observable, action} from 'mobx';

import Backend from './Backend';
const osmQuery = require('query-overpass');


useStrict(true);


export const UIState = {
    INITIAL: "initial",
    DATA_LOAD_INITIATED: "data-load-initiated",
    DATA_LOAD_COMPLETED: "data-load-completed",
    ROUTE_TEXT_EDIT_INITIATED: "route-text-edit-initiated",
    ROUTE_TEXT_EDIT_STARTED: "route-text-edit-started",
    ROUTE_TEXT_EDIT_COMPLETED: "route-text-edit-completed",
    BOUNDARY_TEXT_EDIT_INITIATED: "boundary-text-edit-initiated",
    BOUNDARY_TEXT_EDIT_STARTED: "boundary-text-edit-started",
    BOUNDARY_TEXT_EDIT_COMPLETED: "boundary-text-edit-completed",

    SHOW_SIDEBAR: "show-sidebar",
    HIDE_SIDEBAR: "hide-sidebar",

    SHOW_POLYGON_EDITOR: "show-polygon-editor",
    HIDE_POLYGON_EDITOR: "hide-polygon-editor"
}
 

const state = {
    event: UIState.INITIAL,
    target: undefined,
    modalShouldOpen: false,

    get currentState() {
        return this.event;
    },


    wantOpenRouteTextEditor: action(function(_target) {
        this.event = UIState.ROUTE_TEXT_EDIT_INITIATED;
        this.target = _target;
        this.modalShouldOpen = true;
    }),


    wantCloseRouteTextEditor: action(function(target){
        this.event = UIState.INITIAL;
        this.target = target;
        this.modalShouldOpen = false;
    }),


    wantOpenBoundaryTextEditor: action(function(target){
        this.event = UIState.BOUNDARY_TEXT_EDIT_INITIATED;
        this.target = target;
        this.modalShouldOpen = true;
    }),

    wantBeginEdit: action(function(target){
        switch(this.event) {
            case UIState.BOUNDARY_TEXT_EDIT_INITIATED:
                this.event = UIState.BOUNDARY_TEXT_EDIT_STARTED;
                break;
            case UIState.ROUTE_TEXT_EDIT_INITIATED:
                this.event = UIState.ROUTE_TEXT_EDIT_STARTED;
                break;
            default:
                console.log("wantBeginEdit() Unexpected state ", this.event);
        }
    }),

    wantCloseBoundrayTextEditor: action(function(target){
        this.event = UIState.INITIAL;
        this.target = target;
        this.modalShouldOpen = false;
    }),

    wantCloseCurrent: action(function(target){
        console.log("wnatCloseCurrent() current state ", this.event);
        if (this.event === UIState.ROUTE_TEXT_EDIT_INITIATED 
            || this.event === UIState.BOUNDARY_TEXT_EDIT_INITIATED) {
            this.event = UIState.INITIAL;
            this.target = target;
            this.modalShouldOpen = false;
        }
    }),

    wantSubmitData: action(function(target) {
        console.log("wantSubmitData() ");
    }),

    initiateDataLoad: action(function(){
        console.log('initiateDataLoad() current state', this.event);
        if (this.event !== UIState.DATA_LOAD_INITIATED) {
            this.event = UIState.DATA_LOAD_INITIATED;
        }
    }),

    completeDataLoad: action(function(){
        console.log('completeDataLoad() currentState', this.event);
        if (this.event === UIState.DATA_LOAD_INITIATED) {
            this.event = UIState.DATA_LOAD_COMPLETED;
        }
    }),

    showSidebar: action(
        UIState.SHOW_SIDEBAR, 
        function(target) {
            console.log('showSidebar() currentState: ', this.event);
            this.event = UIState.SHOW_SIDEBAR;
            this.target = target;
        }
    ),

    hideSidebar: action(
        UIState.HIDE_SIDEBAR, 
        function(target) {
            console.log('hideSidebar() currentState: ', this.event);
            this.event = UIState.HIDE_SIDEBAR;
            this.target = target;
        }
    ) ,

    showPolygonTool: action(
        UIState.SHOW_POLYGON_EDITOR, 
        function(target) {
            console.log('showPolygonTool() currentState: ', this.event);
            this.event = UIState.SHOW_POLYGON_EDITOR;
            this.target = target;
        }
    ),
}


export class EditableObject {
    constructor(layer, type, props) {
        this.type = type;
        this.layer = layer;
        const geojsonFeature = {
            type: 'Feature',
            properties: {}
        };
        this.layer.feature = geojsonFeature;
        this.props = props;
    }
}

const defaultGEOJSONFeature = {
    "type":"Feature",
    "id":"",
    "geometry": {},
    "properties": {}
}

export class DataStore {
    backend = new Backend();

    uiState = observable(state);
    
    // user editable geometry data
    drawingData = observable.map(); 
    
    // OpenStreetMap raw data
    osmData = observable.shallowArray([
        defaultGEOJSONFeature], 'Raw OSM data');

    // climbing/boulder data from the backend
    routeData = observable.shallowArray([defaultGEOJSONFeature], 'OpenBeta route data');

    // boundary data from the backend
    boundaryData = observable.shallowArray([defaultGEOJSONFeature], 'OpenBeta boundary data');
    
    constructor() {
        action(this.osmData.clear());
        action(this.routeData.clear());
    }




    getFeature(id) {
        return this.store.get(id);
    }


    registerMarkerHandler(fn) {
        this.store.observe(fn);
    }


    saveToBackend() {
        //console.log(this.store.values());
        const features = this.store.values().map(item => item.layer.toGeoJSON());
        if (features.length > 0) {
            const geojsons = JSON.stringify({
                'type': 'FeatureCollection',
                'features': features
            });
            console.log(geojsons);
            this.backend.save(geojsons, {
                okHandler: function(response) {
                            console.log('DataStore.saveToBackend() ', response);
                            },
                errorHandler:function(ex) {
                                console.log('DataStore.saveToBackend() error:', ex);
                            }
            });
        } else {
            console.log('Nothing to save');
        }
    }


    loadFromBackend({center, radius}) {
        const okHandler = (backendData) => {
            console.log(backendData);
            this.routeData.replace(backendData.route.features);
            this.boundaryData.replace(backendData.boundary.features);
        }

        const errorHandler = (response) => {
            //TODO: cache error
            //response.status,
            //response.statusText
        }

        const options = {
            center: center, 
            radius: radius, 
            okHandler: action('loadFromBackend.okHandler()', okHandler), 
            errorHandler: action('loadFromBackend.errorHandler()', errorHandler)
        }

        this.backend.load(options);
    } //loadFromBackend


    getOSMData (bboxArray) {
        const bbox = bboxArray.join(',');
        const node = `node[sport=climbing](${bbox})`;
        const way = `way[sport=climbing](${bbox})`;
        //const rel = `relation[sport=climbing](${bbox})`;
        const q = `[out:json];(${node};<;${way};<;);out;`;
        console.log('Overpass query: ', q);

        const resultHandler = action('Fetch OSM data', (error, data) => {
            console.log("OSM Error: ", error);
            if (!error && data.features !== undefined) {
                this.osmData.replace(data.features);
                console.log("Raw OSM data: ", data);                
            }
        });
        const options = {
            overpass_url: this.backend.overpass_url,
            flatProperties: false
        }
        osmQuery(q, resultHandler, options);        
    }
}

export const store = new DataStore();
window.store = store;