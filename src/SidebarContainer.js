import React, { Component } from 'react';
import {observer} from 'mobx-react';
import { Sidebar, Segment, Button} from 'semantic-ui-react';

import OSMDetail from './detail-views/OSMDetail';
import ClimbDetail from './detail-views/ClimbDetail';
import {store, UIState} from './DataStore';


const SidebarContainer = observer(({mainContent}) => {

    const visible = store.uiState.event === UIState.SHOW_SIDEBAR;
    const SidebarComponent = detailViewComponentFactory(store.uiState.target);

    console.log("SidebarComp type: ", SidebarComponent);
    return (
        <Sidebar.Pushable as={Segment}>
          <Sidebar as={Segment} animation='overlay' width='very wide' visible={visible} icon='labeled' vertical inverted>
            <div style={{height:'90hv',  marginTop: '5em'}}>

                <HideSidebarButton/>
                {SidebarComponent !== null && <SidebarComponent />}
            </div>
          </Sidebar>
          <Sidebar.Pusher>
            {mainContent}
          </Sidebar.Pusher>
        </Sidebar.Pushable>
    )
});


function detailViewComponentFactory(ViewComponentInfo) {
    return (class extends Component {
        render() {
            if (ViewComponentInfo !== undefined) {
                const TYPE = ViewComponentInfo.type;
                return <TYPE {...ViewComponentInfo.props} />;
            }
            return null;
        }
    });
}


class HideSidebarButton extends Component {

    onClick = () => {
        store.uiState.hideSidebar();
    }

    render() {
        return (<Button onClick={this.onClick}>Close</Button>);
    }
}


export default SidebarContainer