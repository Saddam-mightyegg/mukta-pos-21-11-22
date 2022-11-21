import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import MainApp from "./mainApp";
import TestingComponent from "./TestingComponent";

import Button from "react-bootstrap/Button";

function ScannerrModal(props) {
  return (
    <>
      <Modal
        show={props.show}
        onHide={props.handleClose}
        backdrop="static"
        keyboard={false}
        dialogClassName="modal-90w"
      >
        <Modal.Body>
          <TestingComponent
            getTheCode={props.getTheCode}
            closeTheModal={props.handleClose}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ScannerrModal;
