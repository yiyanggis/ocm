import React from 'react'
import {
    Menu,
    Container,
    Icon
} from 'semantic-ui-react'

import {store} from './DataStore'
import {fsm, UIEvent} from './model/UIState'

import ClimbAddView from './sidebar/ClimbAddView';
import BoundaryAddView from './sidebar/BoundaryAddView';


const TopNav = (props) => (
    <Menu fixed='top'  borderless compact  icon='labeled' >
        <Menu.Menu position='left'>
            <Menu.Item>
                {props.children}
            </Menu.Item>
          </Menu.Menu>
          <Container>
            <Menu.Item as='a' name='climb' leafletRef={props.mapRef} onClick={onClickHandler}>
                <Icon size='massive' name='marker' color='teal' />
                Add a Climb
            </Menu.Item>
            <Menu.Item as='a' name='area' leafletRef={props.mapRef} onClick={onClickHandler}>
                <Icon size='massive' name='object group' color='teal'/>
                Add an Area
            </Menu.Item>
            <Menu.Item as='a' name='osm' leafletRef={props.mapRef} onClick={onClickHandler}>
                <Icon size='massive' name='globe' color='teal'
                />
                Get OSM Data
            </Menu.Item>

            <Menu.Item as='a' name='light' leafletRef={props.mapRef} onClick={onClickHandler}>
                <Icon size='massive' name='map outline' color='teal'
                />
                Light
            </Menu.Item>
            <Menu.Item as='a' name='night' leafletRef={props.mapRef} onClick={onClickHandler}>
                <Icon size='massive' name='map' color='teal'
                />
                Night
            </Menu.Item>
            <Menu.Item as='a' name='topo' leafletRef={props.mapRef} onClick={onClickHandler}>
                <Icon size='massive' name='map signs' color='teal'
                />
                Topo
            </Menu.Item>
            <Menu.Item as='a' name='sattelight' leafletRef={props.mapRef} onClick={onClickHandler}>
                <Icon size='massive' name='map pin' color='teal'
                />
                Sattelight
            </Menu.Item>
        </Container>
    </Menu>
  )

  export default TopNav;

const onClickHandler = (event, data) => {
    const func = executorRefs[data.name];
    if (func === undefined) {
        console.log('##ERROR: unknown menu item ', data.name);
    } else 
        func(data); 
}


const osm = (data) => {
    const zLevel = data.leafletRef.getCurrentZoomLevel();
    if (zLevel < 11) {
        alert(`Current at zoom level ${zLevel}. Please zoom in to level 12 or higher.` );
    } else {
        store.getOSMData(data.leafletRef.getBBox());
    }
}

const area = (data) => {
    console.log(data);
    const event = new UIEvent({VIEW: BoundaryAddView, visible: true});
    fsm.showDetailOnSidebar(event);}

const climb = (data) => {
    console.log(data);   
    const event = new UIEvent({VIEW: ClimbAddView, visible: true});
    fsm.showDetailOnSidebar(event);
}

// avoid eval and use this look up table instead 
const executorRefs = {
    osm: osm,
    area: area,
    climb: climb
}