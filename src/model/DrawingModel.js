import {observable, action} from 'mobx';


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

    /**
     * Add leaflet layer of type to the buffer
     * @param {L.Layer} layer 
     * @param {'point'|'polygon'} type 
     */
    addObject = action( (layer, type) => {
        console.log("addObject() id=%s, type=%s", layer._leaflet_id); 
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
}

export const drawingBuffer = new DrawingBuffer();
window.drawingBuffer = drawingBuffer;