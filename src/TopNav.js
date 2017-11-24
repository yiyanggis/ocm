import React, { Component } from 'react'
import {
    Menu,
    Container,
    Icon
} from 'semantic-ui-react'

import { store } from './DataStore'
import { fsm, UIEvent } from './model/UIState'

import ClimbAddView from './sidebar/ClimbAddView';
import BoundaryAddTips from './sidebar/BoundaryAddTips';


const osm = (data, mapRef) => {
    console.log(data);
    const zLevel = mapRef.getCurrentZoomLevel();
    if (zLevel < 11) {
        alert(`Current at zoom level ${zLevel}. Please zoom in to level 12 or higher.` );
    } else {
        store.getOSMData(mapRef.getBBox());
    }
}

const area = (data) => {
    const event = new UIEvent({VIEW: BoundaryAddTips, visible: true});
    fsm.showDetailOnSidebar(event);}

const climb = (data) => {
    const event = new UIEvent({VIEW: ClimbAddView, visible: true});
    fsm.showDetailOnSidebar(event);
}

// avoid eval and use this look up table instead 
const executorRefs = {
    osm: osm,
    area: area,
    climb: climb
}

class TopNav extends Component {

    onClickHandler = (event, data) => {
        const func = executorRefs[data.name];
        if (func === undefined) {
            console.log('##ERROR: unknown menu item ', data.name);
        } else 
            func(data, this.props.mapRef); 
    }

    render() {
        return (
            <Menu fixed='top'  borderless compact  icon='labeled' >
                <Menu.Menu position='left'>
                    <Menu.Item>
                        {this.props.children}
                    </Menu.Item>
                </Menu.Menu>
                <Container>
                    <Menu.Item as='a' name='climb' onClick={this.onClickHandler}>
                        <Icon size='massive' name='marker' color='teal' />
                        Add a Climb
                    </Menu.Item>
                    <Menu.Item as='a' name='area' onClick={this.onClickHandler}>
                        <Icon size='massive' name='object group' color='teal'/>
                        Add an Area
                    </Menu.Item>
                    <Menu.Item as='a' name='osm' data-mapRef={this.props.mapRef} onClick={this.onClickHandler}>
                        <Icon size='massive' name='globe' color='teal'
                        />
                        Get OSM Data
                    </Menu.Item>
                </Container>
            </Menu>);
    }
}

export default TopNav;