import React, { Component } from 'react';
import {observer} from 'mobx-react';
import { Sidebar, Segment, Button} from 'semantic-ui-react';

import OSMDetailView from './sidebar/OSMDetailView';
import ClimbDetailView from './sidebar/ClimbDetailView';
import BoundaryAddView from './sidebar/BoundaryAddView';
import ClimbAddView from './sidebar/ClimbAddView';
import {fsm} from './model/UIState';

const SidebarContainer = observer(
class SidebarContainer extends Component {

    render() {
        const visible =  this.props.uiState.sidebarDetailView.get().visible;
        console.log("Sidebar visible", visible);
        const event = this.props.uiState.sidebarDetailView.get();
        console.log("Sidebar event", event);
        const width = calcWidthFrom(event);
        return (
            <Sidebar.Pushable as={Segment} padded>
                <Sidebar as={Segment} animation='overlay' width={width} visible={visible} vertical>
                    <div style={{height:'90hv',  marginTop: '5em'}}>
                        <HideSidebarButton/>
                        {event.visible && <event.VIEW  {...event.props}/> }
                    </div>
                </Sidebar>
                <Sidebar.Pusher>
                    {this.props.mainContent}
                </Sidebar.Pusher>
            </Sidebar.Pushable>
        )
    }
});

/**
 * Conditionally determine sidebar width according to incominng view type
 * @param  event 
 */
const calcWidthFrom = (event) => {
    return  event.VIEW === BoundaryAddView ? 'very wide' : 'wide';
}


class HideSidebarButton extends Component {

    onClick = () => {
        fsm.hideSidebar();
    }

    render() {
        return (<Button basic compact size='small' floated='right' onClick={this.onClick}>Close</Button>);
    }
}


export default SidebarContainer