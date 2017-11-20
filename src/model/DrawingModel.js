import {observable, action} from 'mobx';

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
    addObject(layer, type) {
        console.log("addObject() id=%s, type=%s", layer._leaflet_id); 
        this.data.set(layer._leaflet_id, new EditableObject(layer, type, null));
    }


    deleteObject(id) {
        this.data.delete(id);
    }

    re


    updateFeatureProps(id, props) {
        const obj = this.store.get(id);
        obj.props = props;
        obj.layer.feature.properties = props;
    }


    updateGeoJSON = action( (id) => {
        const obj = this.data.get(id);
        obj.layer.feature = obj.layer.toGeoJSON();
        this.data.set(id, obj);
        }
    )
}

export const drawingBuffer = new DrawingBuffer();