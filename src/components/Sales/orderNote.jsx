import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Woocommerce from "../functions/Woocommerce";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Pagination from "react-bootstrap/Pagination";
import Badge from "react-bootstrap/Badge";
import Moment from "react-moment";
import { FormControl, Form } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

class OrderNote extends React.Component {
  render() {
    return (
      <div className="row">
        <Modal
          show={this.props.showNote}
          onHide={this.handleNoteClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Body>
            <Form>
              <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Label>Enter Note</Form.Label>
                <Form.Control
                  as="textarea"
                  rows="3"
                  value={this.props.orderNote}
                  onChange={this.props.handleOrderNote}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.props.handleClearNote}>
              Clear
            </Button>
            <Button variant="secondary" onClick={this.props.handleNoteClose}>
              Ok
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default OrderNote;
