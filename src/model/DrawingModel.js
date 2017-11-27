import { observable, action } from 'mobx';
import L from 'leaflet';

import { store } from '../DataStore';

const EMPTY_GEOJSON = {
    type: 'Feature',
    properties: {}
}

export class EditableObject {
    constructor(layer, type, geoJsonProps) {
        this.type = type;
        this.layer = layer;
        const geojsonFeature = {
            type: 'Feature',
            properties: geoJsonProps
        };
        this.layer.feature = geojsonFeature;
        this.modifiedTS = Date.now();
    }
}


/**
 * Maintain a buffer of user-created and editable geojson objects (polygon, point)
 */
class DrawingBuffer {

    data = observable.map();
    clipboard = observable.box();

    /**
     * Add leaflet layer of type to the buffer
     * @param {L.Layer} layer 
     * @param {'point'|'polygon'} type 
     */
    addObject = action( (layer, type) => {
        console.log("addObject()", layer); 
        this.data.set(layer._leaflet_id, new EditableObject(layer, type, {}));
    })


    deleteObject = action ( (id) => {
        this.data.delete(id);
    })

    
    getGeojson = (id) => {
        const obj = this.data.get(id);
        return obj ? obj.layer.toGeoJSON() : EMPTY_GEOJSON;
    }


    updateFeatureProps = action((id, props) => {
        const obj = this.data.get(id);
        obj.layer.feature.properties = props;
    })


    updateGeoJSON = action( (id) => {
        const obj = this.data.get(id);
        obj.layer.feature = obj.layer.toGeoJSON();
        this.data.set(id, obj);
    })

    polygonsFn = (data) => { 
        return data.values().filter(v => v.type === 'polygon') 
    }

    activateAreaEdit = (roDataIndex) => {
        const roArea = store.boundaryData[roDataIndex];
        const coordinates = roArea.geometry.coordinates[0];
        const pts = coordinates.map(p => [p[1], p[0]]);
        const polygonLayer = new L.polygon(pts);
        this.addObject(polygonLayer, 'polygon');
        return polygonLayer._leaflet_id;
    }

    copyToClipboard = action((object) => {
        console.log('copyToClipboard', object.toGeoJSON());        
        this.clipboard.set(object);
    })
}

export const drawingBuffer = new DrawingBuffer();
window.drawingBuffer = drawingBuffer;