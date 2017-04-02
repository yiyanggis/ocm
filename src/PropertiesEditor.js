import React, { Component } from 'react';
import {Modal} from 'react-bootstrap';
import {observer} from 'mobx-react';

import {UIState} from './DataStore';
import RouteForm from './RouteForm';
import BoundaryForm from './BoundaryForm';


const PropertiesEditor = observer(
    class PropertiesEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modalIsOpen: false,
            targetId: -1,
            event: UIState.INITIAL
        };

        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }


    closeModal() {
        console.log("trying to close dialog");
        this.props.store.uiState.wantCloseCurrent();
    }

    afterOpenModal() {
        //this.props.store.uiState.wantBeginEdit();
    }

    render() {
        const layerId = this.props.store.uiState.target;
        const event = this.props.store.uiState.event;
        console.log("PropertiesEditor render() ", event, layerId);
        return (
            <Modal
                show={this.props.store.uiState.modalShouldOpen}
                keyboard={true}
            >
                <FormSelector event={event} closeFn={this.closeModal} layerId={layerId}/>
            </Modal>
        );
    }
});


function FormSelector(props) {
    console.log("FormSelector: ", props.event)
    switch (props.event) {
        case UIState.BOUNDARY_TEXT_EDIT_INITIATED:
            return (
                <Modal.Body>
                    <h2>Boundary</h2>
                    <BoundaryForm closeFn={props.closeFn} targetId={props.layerId}/>
                </Modal.Body>
                );
        case UIState.ROUTE_TEXT_EDIT_INITIATED:
            return (
                <Modal.Body>
                    <h2>Climb</h2>
                    <RouteForm closeFn={props.closeFn} targetId={props.layerId}/>
                </Modal.Body>
                );
        default:
            console.log("FormSelector() unknown event ", props.event);
            return <div/>
    }
}

export default PropertiesEditor;