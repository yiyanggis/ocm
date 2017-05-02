import React, { Component } from 'react';
import {Modal} from 'react-bootstrap';
import {observer} from 'mobx-react';

import {UIState, wip, store} from './DataStore';
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
        store.uiState.wantCloseCurrent();
    }


    afterOpenModal() {
    }

    componentWillReact() {
        console.log('Edit re-render');
    }

    render() {
        console.log('Editor', store.uiState.shouldEditorOpen.get());
        if (!store.uiState.shouldEditorOpen.get()) {
            return null;
        }

        console.log("PropertiesEditor render() target=", store.uiState.target);
        return (
            <Modal
                show={true}
                keyboard={true}
            >
                    <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-sm">Boundary</Modal.Title>
                </Modal.Header>
                <FormSelector event={store.uiState.event.get()} closeFn={this.closeModal} itemId={store.uiState.target}/>
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
                    <BoundaryForm closeFn={props.closeFn} itemId={props.itemId}/>
                </Modal.Body>
                );
        case UIState.ROUTE_TEXT_EDIT_INITIATED:
            return (
                <Modal.Body>
                    <h2>Climb</h2>
                    <RouteForm closeFn={props.closeFn} targetId={props.itemId}/>
                </Modal.Body>
                );
        default:
            console.log("FormSelector() unknown event ", props.event);
            return <div/>
    }
}

export default PropertiesEditor;