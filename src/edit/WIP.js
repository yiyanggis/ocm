import React, { Component } from 'react';
import {observer} from 'mobx-react';
import {Modal, Button, ListGroup, ListGroupItem} from 'react-bootstrap';

import {store} from '../DataStore';


const WIP = observer(
    class WIP extends Component {   

        closeModal = () => {
            store.uiState.wantCloseCurrent();
        }


        render() {
            if (!store.uiState.shouldWIPOpen.get()) {
                return null;
            }
            return (
                
                <Modal
                    show={true}
                    keyboard={true}>
                    <Modal.Header>
                        <WIPHeader/>
                    </Modal.Header>
                    <Modal.Body>
                        <WIPList/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button 
                            bsStyle="primary"
                            type="submit" 
                            block
                            onClick={this.closeModal}>Close</Button>
                    </Modal.Footer>
                </Modal>)
        }
    }
);


const WIPHeader = observer(() => {
    const size = store.wip.map.size;
    if (size > 0) {
        return <h1>You are editing: {size} items.</h1>;
    } else {
        return <h1>Your workspace is empty.</h1>;
    }
});

const WIPList = observer(() => {
    const list = store.wip.map.entries().map((entry) =>(<CustomListItem key={entry[0]} id={entry[0]} feature={entry[1]} />));        
    return (
            <ListGroup>
                {list}
            </ListGroup> 
            );
});


class CustomListItem extends Component {

    onClick = (id) => {
        console.log("onClick", id);
        store.uiState.wantCloseCurrent();
        store.uiState.wantOpenBoundaryTextEditor(id);
    }


    render() {
        console.log("List item:", this.props.feature, this.props.id);
        const geojson_props = this.props.feature.properties;
        return (
            <ListGroupItem onClick={()=>this.onClick(this.props.id)}>{geojson_props.name}</ListGroupItem>
            )
    }
}

export default WIP;