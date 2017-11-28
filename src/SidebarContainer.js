import React, { Component } from 'react';
import {observer} from 'mobx-react';
import { Sidebar, Segment, Button} from 'semantic-ui-react';


import { fsm } from './model/UIState';

const SidebarContainer = observer(
class SidebarContainer extends Component {

    render() {
        const event = this.props.uiState.sidebarDetailView.get();
        console.log("Sidebar event", event);
        return (
            <Sidebar.Pushable as={Segment} padded>
                <Sidebar as={Segment} animation='overlay' width='very wide' visible={event.visible} vertical style={{zIndex: 9999}} >
                    <div style={{height:'90hv',  marginTop: '8em'}}>
                        <HideSidebarButton/>
                        {event.visible && <event.VIEW  key={event.props.dataIndex} {...event.props}/> }
                    </div>
                </Sidebar>
                <Sidebar.Pusher>
                    {this.props.mainContent}
                </Sidebar.Pusher>
            </Sidebar.Pushable>
        )
    }
});


class HideSidebarButton extends Component {

    onClick = () => {
        fsm.hideSidebar();
    }

    render() {
        return (<Button 
                    size='large' 
                    floated='right'
                    icon='close'
                    onClick={this.onClick}/>);
    }
}


export default SidebarContainer