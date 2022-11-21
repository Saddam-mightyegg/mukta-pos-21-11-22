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
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InputGroup from "react-bootstrap/InputGroup";
import { FormControl } from "react-bootstrap";

import Spinner from "react-bootstrap/Spinner";

var country = [];
var states = [];
var userlist = [];
var customer_name = "Select a customer";
var total_pages = 2;
var customer_id = 0;

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

// var searchedFormElement = {
//  "Customer ID": "search",
//   "Name": "search",
//   "Email": "search"

// }

var searchedElement = {
  search: "",
};

var heading = ["Customer ID", "Name", "Email"];

class CustomerModal2 extends React.Component {
  state = {
    show: false,
    FormView: false,
    userlist: [],
    loading: false,
    error_message: [],
    error_block: [],
  };

  getCustomerList = (page, searchedlist = []) => {
    this.setState({
      loading: true,
      userlist: [],
    });
    var pages = {
      page: page,
    };
    if (searchedlist) {
      pages = {
        page: page,
        ...searchedlist,
      };
    }
    Woocommerce.getCustomerList(pages).then((res) => {
      console.log(res.data);
      this.setState({
        userlist: res.data,
        loading: false,
      });
      userlist = res.data;
    });
  };

  getCustomerName(e) {
    customer_name = e.target.value;
    customer_id = e.target.getAttribute("id");
  }

  handleSearch = (e) => {
    e.preventDefault();
    //alert(e.target.value)
    console.log(searchedElement);
    this.getCustomerList(1, searchedElement);
  };

  handleSearchChange = (e) => {
    searchedElement[e.target.name] = e.target.value;
  };
  customerlist = () => {
    // alert("ho")

    return (
      <form onSubmit={this.handleSearch}>
        <div className=" mb-2  mt-2 col-4">
          <InputGroup>
            <InputGroup.Prepend className="search_icon_wrap">
              <InputGroup.Text>
                <FontAwesomeIcon icon={faSearch} className="search_icon" />
              </InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              placeholder="Search by customer id, name or email"
              aria-label="search"
              className="search_bar"
              name="search"
              onChange={this.handleSearchChange}
            />
          </InputGroup>
        </div>
        <Col>
          <Table striped bordered hover responsive>
            {this.state.loading && (
              <div className="loading  d-flex justify-content-center">
                <div class="spinner-grow text-primary mr-1 " role="status">
                  <span class="sr-only">Loading...</span>
                </div>
                <div class="spinner-grow text-primary mr-1" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
                <div class="spinner-grow text-primary mr-1" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
              </div>
            )}
            <thead>
              <tr>
                {heading.map((head, index) => (
                  <th key={index}>{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {this.state.userlist.map((list, index) => (
                <tr>
                  <td>
                    <Form.Check
                      type="radio"
                      id={list.id}
                      name="radio-group"
                      label={list.id}
                      onChange={this.getCustomerName}
                      value={list.first_name + " " + list.last_name}
                    />
                  </td>
                  <td key={list.username + index}>
                    {" "}
                    {list.first_name + " " + list.last_name}
                  </td>
                  <td key={list.username + index}> {list.email}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
        {
          <PaginationIndex
            total_pages={total_pages}
            getUpdatePaginate={this.getCustomerList}
          />
        }

        <button type="submit"></button>
      </form>
    );
  };
  getCountryList() {
    Woocommerce.getCountryList().then((res) => {
      country = res.data;
    });
  }

  getStateList() {
    Woocommerce.getStateList().then((res) => {
      console.log(res.data);
      states = res.data.states;
    });
  }

  handleFormChange(e) {
    var name = e.target.name;
    var value = e.target.value;

    formChange[name] = value;
  }

  handleTypeaheadChange(e, obj) {
    var value = e[0].name;
    var name = obj;

    formChange[name] = value;
  }

  customerView = (e) => {
    this.setState({
      FormView: e,
    });
  };

  handleShow = () => {
    this.setState({
      show: true,
    });
  };

  handleClose = () => {
    this.setState({
      show: false,
    });
  };

  postCustomer = async () => {
    if (this.state.FormView) {
      this.setState({
        //  username_error: true,
        error_message: "",
        error_block: [],
      });
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
      //console.log(data)

      await Woocommerce.postCustomer(data).then(
        async (res) => {
          console.log(res.data);
          await this.getCustomerList(1);
          await this.props.customerSelection(
            res.data.first_name + " " + res.data.last_name,
            res.data.id
          );
          this.handleClose();
        },
        (error) => {
          var response = "Check your network connection";
          var error_block = [];
          console.log(error.response);
          if (error.response) {
            response = error.response.data.message;
          }

          //   if( error.response.data.data){
          //     error_block = error.response.data.data.params;
          //  }

          this.setState({
            //  username_error: true,
            //  error_message: response,
            error_block: error_block,
            error_message: response,
            loading: false,
          });

          //console.log(error.response)
        }
      );
    } else {
      this.props.customerSelection(customer_name, customer_id);
      this.handleClose();
    }
  };
  /*
   * The second argument that will be passed to
   * `handleChange` from `ToggleButtonGroup`
   * is the SyntheticEvent object, but we are
   * not using it in this example so we will omit it.
   */

  componentDidMount() {
    this.getCountryList();
    this.getStateList();
    this.getCustomerList(1);
  }

  render() {
    var error_message = this.state.error_message;
    var error_block = this.state.error_block;

    return (
      <>
        <div
          className="pointer customer-modal"
          onClick={this.handleShow}
          onKeyPress={this.handleShow}
        >
          {/* <i class="fas fa-plus-circle"></i> */}
          <input className="form-control" value={this.props.customer_name} />
        </div>

        <Modal
          show={this.state.show}
          onHide={this.handleClose}
          backdrop="static"
          keyboard={false}
          dialogClassName="modal-90w"
        >
          <Modal.Header closeButton>
            <ToggleButtonGroup type="radio" name="options" defaultValue={1}>
              <ToggleButton
                value={1}
                className="grid_icon_wrap"
                onClick={() => this.customerView(false)}
              >
                List
              </ToggleButton>
              <ToggleButton
                value={2}
                className="grid_icon_wrap"
                onClick={() => this.customerView(true)}
              >
                New
              </ToggleButton>
            </ToggleButtonGroup>
          </Modal.Header>
          <Modal.Body>
            {this.state.FormView && (
              <>
                <Form>
                  {
                    <div>
                      <div
                        className="text-danger"
                        dangerouslySetInnerHTML={{ __html: error_message }}
                      />
                      {Object.keys(error_block).map(function (
                        keyName,
                        keyIndex
                      ) {
                        return (
                          <div className="text-danger">
                            {error_block[keyName]}
                          </div>
                        );
                      })}
                    </div>
                  }
                  <Form.Row>
                    <Form.Group as={Col} controlId="formGridEmail">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter email"
                        name="email"
                        onChange={this.handleFormChange}
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
                        onChange={this.handleFormChange}
                      />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridEmail">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Last Name"
                        name="last_name"
                        onChange={this.handleFormChange}
                      />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridEmail">
                      <Form.Label>User Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="User Name"
                        name="username"
                        onChange={this.handleFormChange}
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
                        onChange={this.handleFormChange}
                      />
                    </Form.Group>
                  </Form.Row>

                  <Form.Group controlId="formGridAddress1">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      placeholder="1234 Main St"
                      name="address_1"
                      onChange={this.handleFormChange}
                    />
                  </Form.Group>

                  <Form.Group controlId="formGridAddress2">
                    <Form.Label>Address 2</Form.Label>
                    <Form.Control
                      placeholder="Apartment, studio, or floor"
                      name="address_2"
                      onChange={this.handleFormChange}
                    />
                  </Form.Group>

                  <Form.Row>
                    <Form.Group as={Col} controlId="formGridCity">
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        name="city"
                        onChange={this.handleFormChange}
                      />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridState">
                      <Form.Label>State</Form.Label>
                      <Typeahead
                        id="state"
                        labelKey={(option) => `${option["name"]}`}
                        name="state"
                        options={states}
                        placeholder="Choose a state..."
                        onChange={(e) => this.handleTypeaheadChange(e, "state")}
                      />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridState">
                      <Form.Label>Country</Form.Label>
                      <Form.Control
                        value="Bangladesh"
                        disabled
                        name="country"
                        onChange={this.handleFormChange}
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
                      <Form.Control
                        onChange={this.handleFormChange}
                        name="postcode"
                      />
                    </Form.Group>
                  </Form.Row>
                </Form>
              </>
            )}
            {!this.state.FormView && this.customerlist()}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary active" onClick={this.postCustomer}>
              {this.state.FormView
                ? this.state.loading
                  ? "Submiting...."
                  : "Submit"
                : "Add"}
            </Button>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default CustomerModal2;
