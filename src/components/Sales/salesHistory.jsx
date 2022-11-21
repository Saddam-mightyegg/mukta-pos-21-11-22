import React, { useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { Woocommerce } from "../functions/Woocommerce";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Pagination from "react-bootstrap/Pagination";
import Badge from "react-bootstrap/Badge";
import Moment from "react-moment";
import { FormControl, Form } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import ReactToPrint from "react-to-print";

import { Reciept } from "../Product/reciept";

var original_status =
  "pos-sale,pending,processing,on-hold,completed,refunded,shipped,packed";

var heading = [
  "Order Id",
  "Transaction Id",
  "Customer ID,Name,Email",
  "Payment Date",
  "Payment Status",
  "Amount",
  "Action",
];
var page = {
  page: 1,
};

class SalesHistory extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();

    this.state = {
      isLoaded: false,
      show: false,
      list: [],
      selected_page: 1,
      total_pages: 0,
      showDetail: false,
      order_id: 0,
      billing: [],
      cancelling: false,
    };
  }

  handleShow = () => {
    this.setState({
      show: true,
    });

    page["status"] = original_status;

    this.getOrderHistory();
  };

  showTheDetail = async (e, type = true, id = 0) => {
    await this.editTheOrder(e, type);

    if (type) {
      await this.setState({
        showDetail: true,
      });
    } else {
      this.setState({
        order_id: id,
      });
    }
  };

  handleClose = () => {
    this.setState({
      show: false,
    });
  };

  handleCloseDetail = () => {
    this.setState({
      showDetail: false,
    });
  };

  handleForm(e) {
    var name = e.target.name;
    var value = e.target.value;
    if (!value) {
      delete page[name];
    } else {
      page[name] = value;
    }
  }

  search() {
    this.getOrderHistory();
  }

  getOrderHistory = async (type = 0) => {
    await this.setState({
      isLoaded: true,
    });
    if (type === 0) {
      await this.setState({
        list: [],
      });
    }

    await Woocommerce.getOrderHistory(page).then((res) => {
      this.setState({
        list: res.data,

        total_pages: res.headers["x-wp-totalpages"],
      });
    });
    this.setState({
      isLoaded: false,
    });
  };

  changePosStatus = async (e) => {
    var id = e.target.getAttribute("id");
    const data = {
      status: "pos-cancelled",
    };

    var name = "cancelled" + id;

    await this.setState({
      [name]: true,
    });

    await Woocommerce.updateOrder(id, data).then(async (res) => {
      await this.getOrderHistory(1);
    });
    this.setState({
      isLoaded: false,
      [name]: false,
    });
  };

  paginateChange = (e) => {
    var page_number = e.target.getAttribute("index");

    page["page"] = page_number;

    this.setState({
      selected_page: page_number,
    });
    this.getOrderHistory();
  };

  getOrderHistorySubmit = (e) => {
    e.preventDefault();
    page["page"] = 1;
    this.setState({
      selected_page: 1,
    });

    this.getOrderHistory();
  };

  getOrderHistoryReset = (e) => {
    page = {
      page: 1,
    };
    page["status"] = original_status;

    this.getOrderHistory();
    document.getElementById("search-form").reset();
  };

  editTheOrder = (e, status) => {
    var index = e;
    if (status) {
      index = e.target.getAttribute("index");
    }

    var objecttosend = this.state.list;
    var tosend = objecttosend[index];
    console.log(tosend);
    var tax = tosend["tax_lines"]
      ? tosend["tax_lines"][0]["rate_percent"]
      : this.props.taxpercent;
    this.setState({
      billing: tosend["billing"],
      number: tosend["number"],
      taxpercent: tax,
    });
    if (tosend) {
      this.props.sendEditOrderData(tosend);
    }
    // console.log("The order");
    // console.log(tosend);
  };

  listPagination() {
    var total_pages = 10;
    var loopobj = [];

    for (var i = this.state.total_pages; i > 0; i--) {
      loopobj.push(i);
    }
    return (
      <Pagination>
        <Pagination.First />
        <Pagination.Prev />

        {loopobj.map((item, idx) => (
          <Pagination.Item
            active={parseInt(this.state.selected_page) === idx + 1}
            index={idx + 1}
            onClick={this.paginateChange}
          >
            {idx + 1}
          </Pagination.Item>
        ))}

        <Pagination.Next />
        <Pagination.Last />
      </Pagination>
    );
  }

  // componentDidMount(){
  //  this.getOrderHistory()
  // }

  variant(status) {
    var variant = "warning";
    switch (status) {
      case "completed":
        variant = "success";

        break;
      case "cancelled":
        variant = "secondary";
        break;

      case "processing":
        variant = "info";
        break;
    }

    return variant;
  }

  render() {
    return (
      <Form.Group controlId="formGridEmail">
        <a className="btn btn-secondary" onClick={this.handleShow}>
          Sales
        </a>
        <Modal
          show={this.state.show}
          onHide={this.handleClose}
          backdrop="static"
          keyboard={false}
          dialogClassName="modal-90w"
        >
          <Modal.Header closeButton>
            <Form onSubmit={this.getOrderHistorySubmit} id="search-form">
              <Row>
                <Col md={2}>
                  <Form.Control
                    placeholder="Order id"
                    name="search"
                    onChange={this.handleForm}
                  />
                </Col>
                <Col md={3}>
                  <Form.Control
                    name="customer"
                    placeholder="Customer ID"
                    onChange={this.handleForm}
                  />
                </Col>

                <Col md={3}>
                  <Form.Control
                    as="select"
                    onChange={this.handleForm}
                    name="status"
                    defaultValue={""}
                  >
                    <option value="" disabled>
                      Payment status
                    </option>

                    {/* <option>trash</option> */}
                    <option>pos-sale</option>

                    <option>pending</option>
                    <option>processing</option>
                    <option>on-hold</option>
                    <option>completed</option>
                    {/* <option>cancelled</option> */}
                    <option>refunded</option>
                    {/* <option>failed</option> */}
                    {/* <option>pos-cancelled</option> */}
                    <option>shipped</option>
                    <option>packed</option>
                    {/* <option value  = "cancellationreq"> Cacellation Requested by customer</option> */}
                  </Form.Control>
                </Col>

                <Col md={2}>
                  <Button
                    variant="primary"
                    type="submit"
                    onClick={this.getOrderHistorySubmit}
                  >
                    Search
                  </Button>
                </Col>

                <Col md={2}>
                  <Button
                    variant="secondary"
                    onClick={this.getOrderHistoryReset}
                  >
                    <i class="fas fa-sync"></i>
                  </Button>
                </Col>
              </Row>
            </Form>
          </Modal.Header>

          <Modal.Body>
            <div className="row">
              {this.state.isLoaded && (
                <div className="loading  d-flex justify-content-center">
                  <div class="spinner-grow text-primary" role="status">
                    <span class="sr-only">Loading...</span>
                  </div>
                  <div class="spinner-grow text-primary" role="status">
                    <span class="sr-only">Loading...</span>
                  </div>
                  <div class="spinner-grow text-primary" role="status">
                    <span class="sr-only">Loading...</span>
                  </div>
                </div>
              )}
              <div className="m-3">
                <div></div>
              </div>

              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    {heading.map((head, index) => (
                      <th key={index}>{head}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {this.state.list.map((list, index) => (
                    <tr>
                      <td key={index}> {index + 1}</td>

                      <td key={list.id + index}> {list.id}</td>
                      <td key={list.transaction_id + index}>
                        {" "}
                        {list.transaction_id}
                      </td>
                      <td key={list.customer_id + index}>
                        {" "}
                        {list.customer_id +
                          " ," +
                          (list.billing.first_name
                            ? list.billing.first_name
                            : "No name found") +
                          " ," +
                          (list.billing.email
                            ? list.billing.email
                            : "No email found")}
                      </td>
                      <td key={list.date_paid + index}>
                        {list.date_paid ? (
                          <Moment
                            format="DD/MM/YYYY 
               hh:mm:ss"
                          >
                            {list.date_paid}
                          </Moment>
                        ) : (
                          "No Date Available"
                        )}
                      </td>
                      <td key={list.status + index}>
                        <Badge variant={this.variant(list.status)}>
                          {list.status}
                        </Badge>
                      </td>
                      <td key={list.total + index}> {list.total}</td>
                      <td>
                        {
                          <>
                            {/* <a className = "btn btn-primary" index = {index} onClick = {this.editTheOrder}>Edit</a> */}
                            <a
                              className="btn btn-primary btn-sm col-sm-4"
                              index={index}
                              onClick={this.showTheDetail}
                            >
                              Detail
                            </a>
                          </>
                        }

                        <button
                          className={
                            list.status === "cancelled"
                              ? "btn btn-info btn-sm col-sm-4"
                              : "btn btn-secondary btn-sm col-sm-4"
                          }
                          id={list.id}
                          onClick={this.changePosStatus}
                          disabled={
                            list.status === "pos-cancelled" ||
                            list.status === "cancelled"
                              ? true
                              : false
                          }
                        >
                          {list.status === "pos-cancelled" ||
                          list.status === "cancelled"
                            ? "Cancelled"
                            : this.state["cancelled" + list.id]
                            ? "Canceling...."
                            : "Cancel"}
                        </button>

                        <ReactToPrint
                          copyStyles={true}
                          index={index}
                          trigger={() => {
                            // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
                            // to the root node of the returned component as it will be overwritten.
                            return (
                              <Button
                                variant="primary"
                                className="btn-sm col-sm-4"
                              >
                                <FontAwesomeIcon
                                  icon={faPrint}
                                  className="mr-1 "
                                />
                              </Button>
                            );
                          }}
                          content={() => {
                            return this.myRef.current;
                          }}
                          onBeforeGetContent={() =>
                            this.showTheDetail(index, false, list.id)
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {this.listPagination()}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={this.state.showDetail}
          onHide={this.handleCloseDetail}
          backdrop="static"
          keyboard={false}
          dialogClassName="modal-90w"
        >
          <Modal.Header closeButton>
            Date:
            {this.props.order_date ? (
              <Moment
                format="DD/MM/YYYY 
               hh:mm:ss"
              >
                {this.props.order_date}
              </Moment>
            ) : (
              "No Date Available"
            )}
          </Modal.Header>

          <Modal.Body>
            <div>
              {this.state.isLoaded && (
                <div className="loading  d-flex justify-content-center">
                  <div class="spinner-grow text-primary" role="status">
                    <span class="sr-only">Loading...</span>
                  </div>
                  <div class="spinner-grow text-primary" role="status">
                    <span class="sr-only">Loading...</span>
                  </div>
                  <div class="spinner-grow text-primary" role="status">
                    <span class="sr-only">Loading...</span>
                  </div>
                </div>
              )}
              <div className="customerAndData">
                Customer Name: {this.props.customer_name}
              </div>
              {this.props.cartobj.map((item, idx) => {
                var ret = item.short_description.replace("<p>", "");
                ret = ret.replace("</p>", "");
                var fullname = item.name + " " + ret;
                var color = "Nil";
                var size = "Nil";

                item.meta_data.forEach((element) => {
                  if (element.key === "pa_colour") {
                    color = element["display_value"];
                  }
                  if (element.key === "pa_size") {
                    size = element["display_value"];
                  }
                });

                return (
                  <>
                    <div className="row ">
                      <div className="col-6">
                        <div className="col-12">
                          <div className="text"> {fullname} </div>
                          <div className="text">
                            {" "}
                            Color: {color} Size: {size}{" "}
                          </div>

                          <div className="text">
                            {this.props.product_type[idx] &&
                              Object.entries(this.props.product_type[idx]).map(
                                (item) => {
                                  if (
                                    !(
                                      Object.keys(item).length === 0 &&
                                      item.constructor === Object
                                    )
                                  ) {
                                    const [key, value] = item;
                                    return (
                                      <span className="mr-1">
                                        {key}: {value}{" "}
                                      </span>
                                    );
                                  }
                                }
                              )}
                          </div>
                        </div>
                      </div>

                      <div className="col-2">
                        <div className="col-12">
                          <div className="text">{this.props.qty[idx]}</div>
                        </div>
                      </div>

                      <div className="col-4">
                        <div className="col-12">
                          <div className="row">
                            <div className="text col-9">
                              {" "}
                              tk{" "}
                              {this.props.total_price[idx]
                                ? this.props.total_price[idx]
                                : 0}{" "}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <hr />
                  </>
                );
              })}

              <>
                <div className="row">
                  <div className="col-8">
                    <h6 className="text-default col-md-12"> Sub-Total </h6>
                  </div>

                  <div className="col-4">
                    tk.{" "}
                    <span className="text-default col-md-12">
                      {" "}
                      {this.props.original_amount}{" "}
                    </span>
                  </div>
                </div>
                <div className="pl-3">
                  <div className="row">
                    <div className="col-8  ">
                      <h6 className="text-default col-md-12">
                        <span className="text-success">( + ) </span> Tax(
                        {this.state.taxpercent} %)
                      </h6>
                    </div>

                    <div className="col-3">
                      tk.{" "}
                      <span className="text-default col-md-12">
                        {" "}
                        {this.props.tax}{" "}
                      </span>
                    </div>
                  </div>
                  {this.props.couponliststatus &&
                    this.props.coupon.map((item, idx) => (
                      <div className="row">
                        <div className="col-8  ">
                          <h6 className="text-default col-md-12">
                            <span className="text-danger">( - ) </span>{" "}
                            {item["code"]}{" "}
                          </h6>
                        </div>

                        <div className="col-3">
                          tk.{" "}
                          <span className="text-default col-md-12">
                            {" "}
                            {item["discount"]}{" "}
                          </span>
                        </div>
                      </div>
                    ))}

                  <div className="row">
                    <div className="col-8  ">
                      <h6 className="text-default col-md-12">
                        <span className="text-danger">( - ) </span> Discount{" "}
                        {this.props.discount_type}{" "}
                      </h6>
                    </div>

                    <div className="col-3">
                      tk.{" "}
                      <span className="text-default col-md-12">
                        {" "}
                        {this.props.discount}{" "}
                      </span>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-8 ">
                      <h6 className="text-default col-md-12">
                        <span className="text-success">( + ) </span>Fee{" "}
                      </h6>
                    </div>

                    <div className="col-3">
                      tk.{" "}
                      <span className="text-default col-md-12">
                        {" "}
                        {this.props.fees}{" "}
                      </span>
                    </div>
                  </div>
                </div>
                <hr />

                <div className="row">
                  <div className="col-8">
                    <h6 className="text-default col-12"> Total </h6>
                  </div>

                  <div className="col-4">
                    tk.{" "}
                    <span className="text-default col-12">
                      {" "}
                      {this.props.total}{" "}
                    </span>
                  </div>
                </div>
              </>
            </div>
          </Modal.Body>
          <Modal.Footer></Modal.Footer>
        </Modal>

        <div className="d-none">
          <div ref={this.myRef}>
            <Reciept
              cartobj={this.props.cartobj}
              qty={this.props.qty}
              product_type={this.props.product_type}
              total_price={this.props.total}
              discount={this.props.discount}
              fees={this.props.fees}
              original_amount={this.props.original_amount}
              customer_name={this.props.customer_name}
              vat={this.props.tax}
              allAmount={this.props.allAmount}
              changes={0}
              order_id={this.state.order_id}
              billing={this.state.billing}
              couponliststatus={this.props.couponliststatus}
              coupon={this.props.coupon}
              taxpercent={this.state.taxpercent}
              number={this.state.number}
            />
          </div>
        </div>
      </Form.Group>
    );
  }
}

export default SalesHistory;
