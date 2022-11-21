import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import { areEqual } from "../helpers/formElement.js";

import Spinner from "react-bootstrap/Spinner";

function listCart(props) {
  return (
    <div>
      <div className="customerAndData">
        Customer Name: {props.customer_name}
      </div>
      {props.cartobj.map((item, idx) => {
        var ret = item.short_description.replace("<p>", "");
        ret = ret.replace("</p>", "");
        var fullname = item.name + " " + ret;

        return (
          <>
            <div className="row ">
              <div className="col-6">
                <div className="col-12">
                  <div className="text"> {fullname} </div>

                  <div className="text">
                    {props.product_type[idx] &&
                      Object.entries(props.product_type[idx]).map((item) => {
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
                      })}
                  </div>
                </div>
              </div>

              <div className="col-2">
                <div className="col-12">
                  <div className="text">{props.qty[idx]}</div>
                </div>
              </div>

              <div className="col-4">
                <div className="col-12">
                  <div className="row">
                    <div className="text col-9">
                      {" "}
                      tk {props.total_price[idx]
                        ? props.total_price[idx]
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

      {listTotal(props)}
    </div>
  );
}

function listTotal(props) {
  return (
    <>
      <div className="row">
        <div className="col-8">
          <h6 className="text-default col-md-12"> Total </h6>
        </div>

        <div className="col-4">
          tk.{" "}
          <span className="text-default col-md-12">
            {" "}
            {props.original_amount}{" "}
          </span>
        </div>
      </div>
      <div className="pl-3">
        <div className="row">
          <div className="col-8  ">
            <h6 className="text-default col-md-12">
              <span className="text-success">( + ) </span> Tax(
              {props.taxpercent} %)
            </h6>
          </div>

          <div className="col-3">
            tk. <span className="text-default col-md-12"> {props.tax} </span>
          </div>
        </div>

        {props.couponliststatus &&
          props.coupon.map((item, idx) => (
            <div className="row">
              <div className="col-8  ">
                <h6 className="text-default col-md-12">
                  <span className="text-danger">( - ) </span> {item["code"]}{" "}
                </h6>
              </div>

              <div className="col-3">
                tk.{" "}
                <span className="text-default col-md-12">
                  {" "}
                  {item["amount"]}{" "}
                </span>
              </div>
            </div>
          ))}
        <div className="row">
          <div className="col-8  ">
            <h6 className="text-default col-md-12">
              <span className="text-danger">( - ) </span> Discount{" "}
              {props.discount_type}{" "}
            </h6>
          </div>

          <div className="col-3">
            tk.{" "}
            <span className="text-default col-md-12"> {props.discount} </span>
          </div>
        </div>

        {/* <div className = "row">
           <div className = "col-8 ">
               <h6 className = "text-default col-md-12"><span className = "text-success">( + ) </span>Fee </h6>
           </div>

           <div className = "col-3">
               tk. <span className = "text-default col-md-12"> {props.fees} </span>
           </div>

          </div> */}
      </div>
      <hr />

      <div className="row">
        <div className="col-8">
          <h6 className="text-default col-12"> Pay </h6>
        </div>

        <div className="col-4">
          tk. <span className="text-default col-12"> {props.total} </span>
        </div>
      </div>
    </>
  );
}

export const PaymentModal = React.memo(
  React.forwardRef((props, ref) => {
    const [show, setShow] = useState(false);

    // const handleClose = () => setShow(false);
    // const handleShow = () => setShow(true);

    const [value, setValue] = useState([1, 3]);

    /*
     * The second argument that will be passed to
     * `handleChange` from `ToggleButtonGroup`
     * is the SyntheticEvent object, but we are
     * not using it in this example so we will omit it.
     */
    const handleChange = (val) => setValue(val);
    var error_block = props.error_block;

    return (
      <>
        <div
          className=" bg-success-1 text-white pointer"
          onClick={props.handleShow}
        >
          <div className="row  p-2 ">
            <div className="col-md-8">
              <h6 className="text-default col-md-12"> Pay Now </h6>
            </div>

            <div className="col-md-4">
              tk.{" "}
              <span className="text-default col-md-12"> {props.total} </span>
            </div>
          </div>
        </div>

        <Modal
          show={props.showPaymentModal}
          onHide={props.handleClose}
          backdrop="static"
          keyboard={false}
          dialogClassName="modal-90w"
        >
          <Modal.Body>
            <div>
              <div
                className={props.error_message ? "alert alert-danger" : ""}
                role="alert"
                dangerouslySetInnerHTML={{ __html: props.error_message }}
              />
              {Object.keys(error_block).map(function (keyName, keyIndex) {
                return (
                  <div className="alert alert-danger" role="alert">
                    {error_block[keyName]}
                  </div>
                );
              })}
            </div>

            <div className="row">
              <div className="col-md-4">
                <div ref={ref}>
                  <h6>Sales Summary</h6>
                  <hr />
                  {listCart(props)}
                </div>
              </div>
              <div className="col-8">
                <div className="row">
                  <div className="col-8">
                    <h5> Pay </h5>
                  </div>
                  <div className="col-4">
                    <h6> tk {props.total} </h6>
                  </div>
                </div>
                <ToggleButtonGroup
                  type="radio"
                  name="payment_type"
                  defaultValue={1}
                  onClick={props.handlePaymentModeChange}
                >
                  <ToggleButton variant="outline-primary" value={1}>
                    {" "}
                    Cash{" "}
                  </ToggleButton>
                  <ToggleButton variant="outline-primary" value={2}>
                    {" "}
                    Card{" "}
                  </ToggleButton>
                  <ToggleButton variant="outline-primary" value={3}>
                    {" "}
                    Wallet{" "}
                  </ToggleButton>
                </ToggleButtonGroup>
                <hr />

                <div className="row text-center">
                  <h4 className="col-md-3">Amount:</h4>
                  <input
                    value={props.allAmount[props.current_money_mode]}
                    className="form-control col-md-9"
                    onChange={props.changeMoney}
                  />
                </div>

                <hr />

                <div className="row">Change Money: {props.changes}</div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={props.handleClose}>
              Close
            </Button>
            {props.paying ? (
              <Button variant="primary" disabled>
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                Paying......
              </Button>
            ) : (
              <Button variant="primary" onClick={props.postOrder}>
                Pay Now
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      </>
    );
  })
);
