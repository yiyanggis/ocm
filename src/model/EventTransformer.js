import L from 'leaflet';

import { UIEvent } from './UIState';
import { drawingBuffer } from './DrawingModel';
import { store } from '../DataStore';


export const activateAreaEditFn = (roDataIndex) => {
    const roArea = store.boundaryData[roDataIndex];
    const coordinates = roArea.geometry.coordinates[0];
    const pts = coordinates.map(p => [p[1], p[0]]);
    let polygonLayer = L.polygon(pts, {weight: 5});
    console.log('activateAreaEditFn', polygonLayer.toGeoJSON());
        
    const feature = {
        type: "Feature",
        geometry: {},
        foo: 'bar',
        properties: Object.assign({}, roArea.properties)
    };

    polygonLayer.feature = feature;

    console.log('activateAreaEditFn', roArea);
    
    drawingBuffer.copyToClipboard(polygonLayer);
    
    return UIEvent.AreaEditView({layerId: polygonLayer._leaflet_id});
}