import React from 'react';
import { LayerGroup, CircleMarker } from 'react-leaflet';
import { observer } from 'mobx-react';

import {fsm, UIEvent} from '../model/UIState';


/**
 * Observe changes to user drawing data structure.  When a new polygon
 * is added create a clickable circle handle using one of the polygon nodes.
 */
const PolygonAutoHandle = observer(({data, dataFn}) => {
    dataFn = dataFn || (x => x);
    console.log('PolygonAutoHandle', data);
    if (data === undefined) {
        return null;
    }

    const polygonArray = dataFn(data);

    return (
        <LayerGroup>
            <div>
            {   
                polygonArray.map(v =>
                   <ClickableHandle 
                        key={v.layer._leaflet_id} 
                        id={v.layer._leaflet_id}
                        latlng={v.layer._latlngs[0][0]}
                        />)
            }
            </div>
        </LayerGroup>
    );   
});

export default PolygonAutoHandle;


const ClickableHandle = ({id, latlng}) => (
    <CircleMarker
    center={latlng} 
    color='white' 
    weight='3'
    fillColor='#a9cce3' 
    fillOpacity='1' 
    radius={15} 
    onClick={()=>handleOnClick(id)}
    >
        {/* <Popup>
            <span>
                <p>Area name: Some name...</p>
                <p><Button>More...</Button></p>
            </span>
        </Popup> */}
</CircleMarker>
)

const handleOnClick = (layerId) => {
    fsm.showDetailOnSidebar(UIEvent.AreaEditView({layerId: layerId}));
}