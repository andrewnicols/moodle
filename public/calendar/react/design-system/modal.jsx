// Event management imports.
import Modal from 'react-bootstrap/Modal';

// Import Bootstrap CSS. This would be abstracted elsewhere down the line.
import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";

export default function EventModal(props) {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {props.title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {props.body}
            </Modal.Body>
            <Modal.Footer>
                {props.footer}
            </Modal.Footer>
        </Modal>
    );
}
