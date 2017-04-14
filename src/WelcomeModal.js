import React, { Component } from 'react';
import {Modal, Button} from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import {observer} from 'mobx-react';

import {UIState} from './DataStore';


const WelcomeModal = observer(
    class WelcomeModal extends Component {

        constructor(props) {
            super(props);

            this.state = {
                modalIsOpen: true,
                event: UIState.INITIAL
            };

            this.afterOpenModal = this.afterOpenModal.bind(this);
            this.closeModal = this.closeModal.bind(this);
        }


        closeModal() {
            console.log("trying to close dialog");
            this.setState({modalIsOpen: false})
        }


        afterOpenModal() {
        }


        render() {
            const loadCompleted = this.props.uiState === UIState.DATA_LOAD_COMPLETED ? true : false;

            const status = loadCompleted ? <span>{this.props.count} entries loaded.</span> : <p>Loading Europe and North America please wait <FontAwesome name='cog' spin={true}/></p>;
            return (
                <Modal show={this.state.modalIsOpen}
                    keyboard={true} >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-sm">Welcome to Open Climb Map - Search Feature comming soon</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h2>{status}</h2>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle="success" disabled={!loadCompleted} onClick={this.closeModal}><FontAwesome name='times'/>&nbsp;Close</Button>
                    </Modal.Footer>
                </Modal>
            );
        }
});

export default WelcomeModal;