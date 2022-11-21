import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Woocommerce } from "../functions/Woocommerce";
import { FormControl, Form } from "react-bootstrap";
import NumPad from "react-numpad";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import { AsyncTypeahead } from "react-bootstrap-typeahead";

import OrderNote from "../Sales/orderNote";

class Cart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      isLoaded: false,
      showNote: false,
      option: [],
      isLoading: false,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    // if(this.props.editOrder===true){
    //   return  false;
    // }

    // if(nextProps.editOrder===true){
    //   return  false;
    // }
    if (this.props.taxpercent !== nextProps.taxpercent) {
      return true;
    }
    if (this.props.cartobj !== nextProps.cartobj) {
      return true;
    }

    if (this.props.total !== nextProps.total) {
      return true;
    }

    if (this.props.total_price !== nextProps.total_price) {
      return true;
    }

    if (this.props.qty !== nextProps.qty) {
      return true;
    }

    if (this.props.discount !== nextProps.discount) {
      return true;
    }

    if (this.props.origianl_amount !== nextProps.origianl_amount) {
      return true;
    }

    if (this.props.discountstatus !== nextProps.discountstatus) {
      return true;
    }

    if (this.props.feesstatus !== nextProps.feesstatus) {
      return true;
    }

    if (this.props.couponliststatus !== nextProps.couponliststatus) {
      return true;
    }

    if (this.props.coupon) {
      return true;
    }

    if (this.props.fees !== nextProps.fees) {
      return true;
    }

    if (this.props.discount_type !== nextProps.discount_type) {
      return true;
    }

    if (this.props.changes !== nextProps.changes) {
      return true;
    }

    if (this.props.payment_type !== nextProps.payment_type) {
      return true;
    }

    if (this.props.payAmount !== nextProps.payAmount) {
      return true;
    }

    if (this.props.showPaymentModal !== nextProps.showPaymentModal) {
      return true;
    }

    if (this.props.customer_name !== nextProps.customer_name) {
      return true;
    }

    if (this.props.orderNote !== nextProps.orderNote) {
      return true;
    }

    if (this.state.showNote !== nextState.showNote) {
      return true;
    }

    if (this.props.percent !== nextProps.percent) {
      return true;
    }

    if (this.props.tax !== nextProps.tax) {
      return true;
    }

    if (this.state.option !== nextState.option) {
      return true;
    }

    return false;
  }

  getSumoList = (query) => {
    this.setState({ isLoading: true });

    var data = {
      search: query,
    };
    Woocommerce.getSumoList(data).then(async (res) => {
      await this.setState({
        option: res.data,
        isLoading: false,
      });
    });
  };
  componentDidMount() {
    Woocommerce.getProducts().then((res) => {
      //  console.log(res.data);
      this.setState({
        products: res.data,
        isLoaded: true,
      });
    });
  }

  handleNoteShow = async () => {
    await this.setState({
      showNote: true,
    });
  };

  handleNoteClose = () => {
    this.setState({
      showNote: false,
    });
  };

  listCart() {
    return (
      <div>
        {this.props.cartobj.map((item, idx) => {
          var ret = item.short_description.replace("<p>", "");
          ret = ret.replace("</p>", "");
          var fullname = item.name + " " + ret;
          return (
            <>
              {/* {console.log(item)} */}
              <div className="row ">
                <div className="col-md-4">
                  <div className="col-md-12">
                    <div className="text"> {fullname} </div>

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
                              //console.log("hereeeeeeeee")
                              //console.log(item)
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

                <div className="col-md-4">
                  <Form.Control
                    size="lg"
                    type="text"
                    className="input_qty"
                    placeholder="Large text"
                    data-index={idx}
                    value={this.props.qty[idx]}
                    onChange={this.props.changeQty}
                  />
                </div>

                <div className="col-md-4">
                  <div className="col-md-12">
                    <div className="row">
                      <div className="text col-md-9">
                        {" "}
                        tk{" "}
                        {this.props.total_price[idx]
                          ? this.props.total_price[idx]
                          : 0}{" "}
                      </div>

                      {
                        // <div className = "col-md-3">
                        //      <i class="fal fa-angle-right"></i>
                        // </div>
                      }

                      <div
                        className="col-md-3 pointer"
                        data-index={idx}
                        onClick={this.props.removeFromTheCart}
                      >
                        <i
                          class="fal fa-times"
                          data-index={idx}
                          aria-hidden="true"
                        ></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <hr />
            </>
          );
        })}
      </div>
    );
  }

  render() {
    return (
      <>
        <div className="m-2">
          <div className="row ">
            <div className="col-md-4">
              <div className="col-md-12">
                <h6 className="text-primary"> Product </h6>
              </div>
            </div>

            <div className="col-md-4">
              <div className="col-md-12">
                <h6 className="text-primary"> Qty </h6>
              </div>
            </div>

            <div className="col-md-4">
              <div className="col-md-12">
                <h6 className="text-primary"> Price </h6>
              </div>
            </div>
          </div>

          {this.listCart()}

          <div className="row">
            <div className="col-md-8">
              <h6 className="text-default col-md-12"> Total </h6>
            </div>

            <div className="col-md-4">
              tk.{" "}
              <span className="text-default col-md-12">
                {" "}
                {this.props.original_amount}{" "}
              </span>
            </div>
          </div>
          <div className="pl-3">
            {this.props.discountstatus && (
              <div className="row">
                <div className="col-md-8  ">
                  <h6 className="text-default col-md-12">
                    <span className="text-danger">( - ) </span> Discount{" "}
                    {this.props.discount_type === "(%)"
                      ? "(" + this.props.percent + "%" + ")"
                      : this.props.discount_type}{" "}
                  </h6>
                </div>

                <div className="col-md-3">
                  tk.{" "}
                  <span className="text-default col-md-12">
                    {" "}
                    {this.props.discount}{" "}
                  </span>
                </div>
                <div
                  className="col-md-1 pull-left pointer"
                  type="discount"
                  onClick={this.props.removeAdditionalFees}
                >
                  <i
                    class="fal fa-times"
                    type="discount"
                    aria-hidden="true"
                  ></i>
                </div>
              </div>
            )}

            {this.props.feesstatus && (
              <div className="row">
                <div className="col-md-8 ">
                  <h6 className="text-default col-md-12">
                    <span className="text-success">( + ) </span>Fee{" "}
                  </h6>
                </div>

                <div className="col-md-3">
                  tk.{" "}
                  <span className="text-default col-md-12">
                    {" "}
                    {this.props.fees}{" "}
                  </span>
                </div>
                <div
                  className="col-md-1 pull-left pointer"
                  type="fees"
                  onClick={this.props.removeAdditionalFees}
                >
                  <i class="fal fa-times" type="fees" aria-hidden="true"></i>
                </div>
              </div>
            )}

            {this.props.couponliststatus &&
              this.props.coupon.map((item, idx) => (
                <div className="row">
                  <div className="col-md-8  ">
                    <h6 className="text-default col-md-12">
                      <span className="text-danger">( - ) </span> {item["code"]}{" "}
                    </h6>
                  </div>

                  <div className="col-md-3">
                    tk.{" "}
                    <span className="text-default col-md-12">
                      -{item["amount"]}{" "}
                    </span>
                  </div>
                  <div
                    className="col-md-1 pull-left pointer"
                    type="discount"
                    id={idx}
                    onClick={this.props.removeCoupon}
                  >
                    <i
                      class="fal fa-times"
                      type="discount"
                      aria-hidden="true"
                    ></i>
                  </div>
                </div>
              ))}
            <div className="row">
              <div className="col-md-8 ">
                <h6 className="text-default col-md-12">
                  <span className="text-success">( + ) </span>Tax(
                  {this.props.taxpercent} %)
                </h6>
              </div>

              <div className="col-md-3">
                tk.{" "}
                <span className="text-default col-md-12">
                  {" "}
                  {this.props.tax}{" "}
                </span>
              </div>
            </div>
          </div>
          <hr />

          <div className="row">
            <div className="col-md-8">
              <h6 className="text-default col-md-12"> Subtotal </h6>
            </div>
            <div className="col-md-4">
              tk.{" "}
              <span className="text-default col-md-12">
                {" "}
                {this.props.total}{" "}
              </span>
            </div>
          </div>
          <hr />
          <div>
            <Dropdown as={ButtonGroup}>
              <Dropdown.Toggle
                variant="outline-primary mr-1"
                size="sm"
                id="dropdown-basic"
              >
                Add discount
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <NumPad.Number
                  onChange={(value) =>
                    this.props.discountCalculation(value, "discount")
                  }
                  decimal={2}
                  negative={false}
                >
                  <Dropdown.Item>%</Dropdown.Item>
                </NumPad.Number>

                <NumPad.Number
                  onChange={(value) =>
                    this.props.discountCalculation(value, "fees")
                  }
                  decimal={2}
                  negative={false}
                >
                  <Dropdown.Item>Taka</Dropdown.Item>
                </NumPad.Number>
              </Dropdown.Menu>
            </Dropdown>

            <NumPad.Number
              onChange={this.props.feesCalculation}
              decimal={2}
              negative={false}
            >
              <a className="btn btn-outline-primary mr-1 btn-sm">Add Fee</a>
            </NumPad.Number>
            <a
              className="btn btn-outline-primary mr-1 btn-sm"
              onClick={this.handleNoteShow}
            >
              Add Note
            </a>
          </div>

          <div class="row mt-1">
            <div class="col-8">
              <AsyncTypeahead
                clearButton
                disabled={this.props.cartobj.length > 0 ? false : true}
                isLoading={this.state.isLoading}
                labelKey={(option) => {
                  return `${option.code}`;
                }}
                onSearch={this.getSumoList}
                onChange={this.props.handleSumoCodeSubmit}
                options={this.state.option}
                placeholder="Choose a coupon..."
              />
            </div>
          </div>
        </div>

        <OrderNote
          showNote={this.state.showNote}
          handleNoteClose={this.handleNoteClose}
          handleOrderNote={this.props.handleOrderNote}
          handleClearNote={this.props.handleClearNote}
          orderNote={this.props.orderNote}
        />
      </>
    );
  }
}

export default Cart;
