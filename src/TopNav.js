import React, {Component} from 'react'
import {Menu, Container, Icon, Segment, Portal, Button} from 'semantic-ui-react'

import {store} from './DataStore'
import {fsm, UIEvent} from './model/UIState'

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

const open=true;

class TopNav extends Component {

    constructor(){
        super();
        this.state={
            lightactive:true,
            nightactive:false,
            topoactive:false,
            satelliteactive:false,
        }
    }
    

    onClickHandler = (event, data) => {
        const func = executorRefs[data.name];
        if (func === undefined) {
            console.log('##ERROR: unknown menu item ', data.name);
        } else 
            func(data, this.props.mapRef); 
    }

    toggleLayerHandler = (event, data) => {
        let map=this.props.mapRef;
        this.removeLayer(map.lightLayer.leafletElement,map);
        this.removeLayer(map.nightLayer.leafletElement,map);
        this.removeLayer(map.outdoorsLayer.leafletElement,map);
        this.removeLayer(map.satelliteLayer.leafletElement,map);

        //TODO use dictionary or Radio button group to 
        // eliminate this long switch statement
        switch(data.name){
            case "light":
                map.leafletRef.leafletElement.addLayer(map.lightLayer.leafletElement);
                this.setState({
                    lightactive:true,
                    nightactive:false,
                    topoactive:false,
                    satelliteactive:false
                })
                break;
            case "night":
                map.leafletRef.leafletElement.addLayer(map.nightLayer.leafletElement);
                this.setState({
                    lightactive:false,
                    nightactive:true,
                    topoactive:false,
                    satelliteactive:false
                })
                break;
            case "topo":
                map.leafletRef.leafletElement.addLayer(map.outdoorsLayer.leafletElement);
                this.setState({
                    lightactive:false,
                    nightactive:false,
                    topoactive:true,
                    satelliteactive:false
                })
                break;
            case "satellite":
                map.leafletRef.leafletElement.addLayer(map.satelliteLayer.leafletElement);
                this.setState({
                    lightactive:false,
                    nightactive:false,
                    topoactive:false,
                    satelliteactive:true
                })
                break;
            default:
                console.log('Wrong layer name', data.name);
            
        }

    }

    removeLayer = (layer, map) => {
        if(map.leafletRef.leafletElement.hasLayer(layer)){
            map.leafletRef.leafletElement.removeLayer(layer)
        }
    }

    render() {
        let searchBtn=null;
        if(this.props.needSearch){
            searchBtn=
            <Portal
                open={this.props.needSearch}
                closeOnTriggerClick
                openOnTriggerClick
                trigger={(
                  <Button
                    ref={btn=>this.popupSearch=btn}
                    style={{display:'none'}}
                    content={open ? 'Close Portal' : 'Open Portal'}
                    negative={open}
                    positive={!open}
                  />
                )}
                onOpen={this.handleOpen}
                onClose={this.handleClose}
            >
                <Segment style={{cursor: 'pointer', left: '45%', position: 'fixed', top: '120px', zIndex: 1000 }}>
                    <Menu.Item id='searchBtn' as='a' name="search" data-mapRef={this.props.mapRef} onClick={()=>{this.props.redoSearch(this.props.mapRef.state.lat,this.props.mapRef.state.lng, store.radius)}}>
                        <Icon name='search' color='teal'
                        />
                        Search
                    </Menu.Item>
                </Segment>
            </Portal>
            
        }
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
                <Container id='rightMenu'>
                    <Segment.Group horizontal={true} raised>
                        <Menu.Item as='a' name='light' active={this.state.lightactive} data-mapRef={this.props.mapRef} onClick={this.toggleLayerHandler}>
                            <Icon size='massive' name='sun' color='yellow'
                            />
                            Light
                        </Menu.Item>
                        <Menu.Item as='a' name='night' active={this.state.nightactive} data-mapRef={this.props.mapRef} onClick={this.toggleLayerHandler}>
                            <Icon size='massive' name='moon' color='blue'
                            />
                            Night
                        </Menu.Item>
                        <Menu.Item as='a' name='topo' active={this.state.topoactive} data-mapRef={this.props.mapRef} onClick={this.toggleLayerHandler}>
                            <Icon size='massive' name='map outline' color='green'
                            />
                            Topo
                        </Menu.Item>
                        <Menu.Item as='a' name='satellite' active={this.state.satelliteactive} data-mapRef={this.props.mapRef} onClick={this.toggleLayerHandler}>
                            <Icon size='massive' name='space shuttle' color='grey'
                            />
                            Satellite
                        </Menu.Item>
                    </Segment.Group>
                </Container>
            </Menu>);
    }
}

export default TopNav;