import React, {Component} from 'react'
import {store} from './DataStore'
import {Menu, Container, Icon, Segment, Portal, Button} from 'semantic-ui-react'
import {fsm, UIEvent} from './model/UIState'


class SearchBtn extends Component {

    constructor(){
        super();
        this.state={
            lightactive:true,
            nightactive:false,
            topoactive:false,
            satelliteactive:false,
        }
    }
    

    render() {
        let searchBtn=null;
        if(this.props.needSearch){
            searchBtn=
            
                <Segment style={{cursor: 'pointer', left: '45%', position: 'fixed', top: '120px', zIndex: 1000 }}>
                    <Menu.Item id='searchBtn' as='a' name="search" data-mapRef={this.props.mapRef} onClick={()=>{this.props.redoSearch(this.props.mapRef.state.lat,this.props.mapRef.state.lng, store.radius)}}>
                        <Icon name='search' color='teal'
                        />
                        Search
                    </Menu.Item>
                </Segment>
            
            
        }
        return (
            <Container>
                {searchBtn}
            </Container>
            );
            
    }
}

export default SearchBtn;