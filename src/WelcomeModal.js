import React, { Component } from 'react';
import {Image, Button, Jumbotron} from 'react-bootstrap';
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

            var button;
            var status;
            if (loadCompleted) {
                if (!this.state.modalIsOpen) {
                    return null;
                }
                status = <span>{this.props.count} entries found.</span>;
                button = <Button bsStyle="info" onClick={this.closeModal}><FontAwesome name='check'/> Continue</Button>
            } else {
                button = <Button bsStyle="default" disabled={true} ><FontAwesome name='cog' spin={true}/> Please Wait</Button>
            }
            return (
                <Jumbotron className="welcome-jumbotron" >
                    <h1>Search Feature coming soon!</h1>
                    <h3>Loading Europe and North America.... {status}</h3>
                    {button}
                    {this.props.error.code !== 200 && <p>Oops! This is embarassing (API server error: {this.props.error.code}-{this.props.error.msg})</p>}
                </Jumbotron>
            );
        }
});

export default WelcomeModal;