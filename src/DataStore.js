import {useStrict, observable, action, computed} from 'mobx';

import Backend from './Backend';

useStrict(true);


export const UIState = {
    INITIAL: "initial",
    DATA_LOAD_INITIATED: "data-load-initiated",
    DATA_LOAD_COMPLETED: "data-load-completed",
    ROUTE_TEXT_EDIT_INITIATED: "route-text-edit-initiated",
    ROUTE_TEXT_EDIT_STARTED: "route-text-edit-started",
    ROUTE_TEXT_EDIT_COMPLETED: "route-text-edit-completed",
    WORK_IN_PROGRESS_VIEW_INITIATED: "work-in-progress-view-initiated",
    WORK_IN_PROGRESS_VIEW_COMPLETED: "work-in-progress-view-completed",
    BOUNDARY_TEXT_EDIT_INITIATED: "boundary-text-edit-initiated",
    BOUNDARY_TEXT_EDIT_STARTED: "boundary-text-edit-started",
    BOUNDARY_TEXT_EDIT_COMPLETED: "boundary-text-edit-completed",

}


export const GradeType = {
        YSD: 'Yosemite Decimal System',
        V: 'Hueco V-scale',
        FR: 'French',
    }

export class Grade {
	constructor(value, type) {
		this.value = value;
		this.type = type;
	}
}

export class Route {
	constructor(name, grade) {
		this.name = name;
		this.grade = grade;
	}
}

export class Marker {
	constructor(layer) {
		this.layer = layer;
	}
}


class UIStateMachine  {
    
    constructor () {
        this.event = observable.box(UIState.INITIAL);
        this.target = observable(0);
    }


    wantOpenRouteTextEditor = action(function(_target) {
        this.event.set(UIState.ROUTE_TEXT_EDIT_INITIATED);
        this.target = _target;
    })


    wantCloseRouteTextEditor = action(function(target){
        this.event.set(UIState.INITIAL);
        this.target = target;
        this.modalShouldOpen = false;
    })


    // Initiate adding or updating boundary
    // target is the working item id, or 'undefined' when adding new
    wantOpenBoundaryTextEditor = action((target) => {
        this.event.set(UIState.BOUNDARY_TEXT_EDIT_INITIATED);
        this.target = target;
    })

    
    wantOpenWIPView = action((target)=> {
        this.event.set(UIState.WORK_IN_PROGRESS_VIEW_INITIATED);
        this.target = target;
    })


    wantCloseWIPView = action(function(){
        this.event.set(UIState.INITIAL);
        this.target = undefined;
    })


    wantCloseBoundrayTextEditor = action(function(target){
        this.event.set(UIState.INITIAL);
        this.target = target;
        this.modalShouldOpen = false;
    })


    wantCloseCurrent = action((target) => {
        console.log("wnatCloseCurrent() before ", this.event.get());
        this.event.set(UIState.INITIAL);
        console.log("wnatCloseCurrent() after  ", this.event.get());

        this.target = target;
        this.modalShouldOpen = false;
    })


    wantSubmitData = action(function(target) {
        console.log("wantSubmitData() ");
    })


    initiateDataLoad = action(function(){
        console.log('initiateDataLoad() current state', this.event);
        if (this.event.get() !== UIState.DATA_LOAD_INITIATED) {
            this.event.set(UIState.DATA_LOAD_INITIATED);
        }
    })


    completeDataLoad = action(function(){
        console.log('completeDataLoad() currentState', this.event);
        if (this.event.get() === UIState.DATA_LOAD_INITIATED) {
            this.event.set(UIState.DATA_LOAD_COMPLETED);
        }
    })


    shouldEditorOpen = computed(() => {
        console.log("shouldEditorOpen", this.event.get());    
        return this.event.get() === UIState.BOUNDARY_TEXT_EDIT_INITIATED ||
         this.event.get() === UIState.ROUTE_TEXT_EDIT_INITIATED;
    })


    shouldWIPOpen = computed(() => {
        console.log('shouldWIPOpen', this.event.get());
        console.log('target=', this.event.target);
        return this.event.get() === UIState.WORK_IN_PROGRESS_VIEW_INITIATED;
    })    
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


export class DataStore {
    uiState = new UIStateMachine();
    store = observable.map();
    wip = new WorkInProgress();
    backend = new Backend();


    addObject(layer, type) {
        console.log("addObject() id=%s, type=%s", layer._leaflet_id, type); 
        this.store.set(layer._leaflet_id, new EditableObject(layer, type, null));
    }


    deleteObject(id) {
        this.store.delete(id);
    }


    updateFeatureProps(id, props) {
        const obj = this.store.get(id);
        obj.props = props;
        obj.layer.feature.properties = props;
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
}


class WorkInProgress {

    constructor() {
        this.map = observable.shallowMap(); // Work-In-Progress items
        this.id = 0;
    }

    nextId() {
        this.id = this.id - 1;
        return this.id;
    }

    // Add a new WIP item
    addNew(item) {
        const id = this.nextId();
        this.map.set(id, item);
        this.selectedId = id;
        return id;
    }


    updateOrAdd(id, item) {
        if (id === undefined) {
            id = this.addNew(item);
        } 
        else {

            this.map.set(id, item);
        }
        this.selectedId = id;
        return id;
    }

   // workingItemId = () => (this.selectedId)
}


export const store = new DataStore();
window.store = store;
//window.wip = wip;