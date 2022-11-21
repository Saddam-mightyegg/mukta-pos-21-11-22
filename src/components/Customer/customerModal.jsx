import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import { Woocommerce } from "../functions/Woocommerce";
import { Typeahead } from "react-bootstrap-typeahead"; // ES2015
import { areEqual } from "../helpers/formElement.js";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import Table from "react-bootstrap/Table";
import Pagination from "react-bootstrap/Pagination";
import PaginationIndex from "../paginationIndex";

var country = [];
var states = [];
var userlist = [];
var customer_name = "";
var total_pages = 0;

var formChange = {
  email: "",
  first_name: "",
  last_name: "",
  username: "",
  address_1: "",
  address_2: "",
  city: "",
  state: "",
  postcode: "",
  country: "BD",
  phone: "",
  password: "123",
};

var heading = [" Customer ID", "Name"];
function getCustomerList(page) {
  var pages = {
    page: page,
  };
  Woocommerce.getCustomerList(pages).then((res) => {
    console.log(res.data);
    userlist = res.data;
    total_pages = res.headers["x-wp-totalpages"];
  });
}

function getCustomerName(e) {
  customer_name = e.target.value;
}

// function setPage(number){

//   alert(number)
//   selected_page = number;
// }

function listPagination() {
  var selected_page = 4;

  var total_pages = 10;
  var loopobj = [];

  for (var i = total_pages; i > 0; i--) {
    loopobj.push(i);
  }
  return (
    <Pagination>
      <Pagination.First />
      <Pagination.Prev />

      {loopobj.map((item, idx) => (
        <Pagination.Item
          active={parseInt(selected_page) === idx + 1}
          onClick={() => (selected_page = idx + 1)}
        >
          {idx + 1}
        </Pagination.Item>
      ))}

      <Pagination.Next />
      <Pagination.Last />
    </Pagination>
  );
}

function customerlist() {
  return (
    <div>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            {heading.map((head, index) => (
              <th key={index}>{head}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {userlist.map((list, index) => (
            <tr>
              <td>
                <Form.Check
                  type="radio"
                  id={list.id}
                  name="radio-group"
                  label={list.id}
                  onChange={getCustomerName}
                  value={list.username}
                />
              </td>
              <td key={list.username + index}> {list.username}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      {
        <PaginationIndex
          total_pages={total_pages}
          getUpdatePaginate={getCustomerList}
        />
      }
    </div>
  );
}
function getCountryList() {
  Woocommerce.getCountryList().then((res) => {
    country = res.data;
  });
}

function getStateList() {
  Woocommerce.getStateList().then((res) => {
    console.log(res.data);
    states = res.data.states;
  });
}

function handleFormChange(e) {
  var name = e.target.name;
  var value = e.target.value;

  formChange[name] = value;
}

function handleTypeaheadChange(e, obj) {
  var value = e[0].name;
  var name = obj;

  formChange[name] = value;
}

function CustomerModal(props) {
  const [show, setShow] = useState(false);
  const [FormView, customerView] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [value, setValue] = useState([1, 3]);
  function postCustomer() {
    if (FormView) {
      const data = {
        email: formChange["email"],
        first_name: formChange["first_name"],
        last_name: formChange["last_name"],
        username: formChange["username"],
        password: "123",
        billing: {
          first_name: formChange["first_name"],
          last_name: formChange["last_name"],
          address_1: formChange["address_1"],
          address_2: formChange["address_2"],
          city: formChange["city"],
          state: formChange["state"],
          postcode: formChange["postcode"],
          country: formChange["country"],
          email: formChange["email"],
          phone: formChange["phone"],
        },
      };
      console.log(data);

      Woocommerce.postCustomer(data).then((res) => {
        console.log(res.data);
        handleClose();
        getCustomerList(1);
      });
    } else {
      props.customerSelection(customer_name);
    }
  }
  /*
   * The second argument that will be passed to
   * `handleChange` from `ToggleButtonGroup`
   * is the SyntheticEvent object, but we are
   * not using it in this example so we will omit it.
   */

  const handleChange = (val) => setValue(val);

  getCountryList();
  getStateList();
  getCustomerList(1);

  return (
    <>
      <div className="pointer customer-modal" onClick={handleShow}>
        <i class="fas fa-plus-circle"></i>
      </div>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        dialogClassName="modal-90w"
      >
        <Modal.Body>
          <div className="col-md-3">
            <ToggleButtonGroup type="radio" name="options" defaultValue={1}>
              <ToggleButton
                value={1}
                className="grid_icon_wrap"
                onClick={() => customerView(false)}
              >
                List
              </ToggleButton>
              <ToggleButton
                value={2}
                className="grid_icon_wrap"
                onClick={() => customerView(true)}
              >
                New
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
          {FormView && (
            <Form>
              <Form.Row>
                <Form.Group as={Col} controlId="formGridEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    name="email"
                    onChange={handleFormChange}
                  />
                </Form.Group>
              </Form.Row>

              <Form.Row>
                <Form.Group as={Col} controlId="formGridEmail">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="First Name"
                    name="first_name"
                    onChange={handleFormChange}
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridEmail">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Last Name"
                    name="last_name"
                    onChange={handleFormChange}
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridEmail">
                  <Form.Label>User Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="User Name"
                    name="username"
                    onChange={handleFormChange}
                  />
                </Form.Group>
              </Form.Row>

              <Form.Row>
                <Form.Group as={Col} controlId="formGridPhone">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Phone Number"
                    name="phone"
                    onChange={handleFormChange}
                  />
                </Form.Group>
              </Form.Row>

              <Form.Group controlId="formGridAddress1">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  placeholder="1234 Main St"
                  name="address_1"
                  onChange={handleFormChange}
                />
              </Form.Group>

              <Form.Group controlId="formGridAddress2">
                <Form.Label>Address 2</Form.Label>
                <Form.Control
                  placeholder="Apartment, studio, or floor"
                  name="address_2"
                  onChange={handleFormChange}
                />
              </Form.Group>

              <Form.Row>
                <Form.Group as={Col} controlId="formGridCity">
                  <Form.Label>City</Form.Label>
                  <Form.Control name="city" onChange={handleFormChange} />
                </Form.Group>
                <Form.Group as={Col} controlId="formGridState">
                  <Form.Label>State</Form.Label>
                  <Typeahead
                    id="state"
                    labelKey={(option) => `${option["name"]}`}
                    name="state"
                    options={states}
                    placeholder="Choose a state..."
                    onChange={(e) => handleTypeaheadChange(e, "state")}
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridState">
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    value="Bangladesh"
                    disabled
                    name="country"
                    onChange={handleFormChange}
                  />

                  {
                    //   <Typeahead
                    // id = "occupation_id"
                    // labelKey ={(option) => `${option["name"]}`}
                    // name = "name"
                    // options={country}
                    // placeholder="Choose a country..."
                    // />
                  }
                </Form.Group>

                <Form.Group as={Col} controlId="formGridZip">
                  <Form.Label>Zip</Form.Label>
                  <Form.Control onChange={handleFormChange} name="postcode" />
                </Form.Group>
              </Form.Row>
            </Form>
          )}
          {!FormView && customerlist()}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary active" onClick={postCustomer}>
            {FormView ? "Submit" : "Add"}
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default React.memo(CustomerModal, areEqual);
