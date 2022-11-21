import React, { useState, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faPrint } from "@fortawesome/free-solid-svg-icons";

import ReactToPrint from "react-to-print";

import { Reciept } from "./reciept";

export const PaymentSuccessModal = React.forwardRef((props, ref) => {
  // console.log("success")

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [value, setValue] = useState([1, 3]);
  const componentRef = useRef();

  /*
   * The second argument that will be passed to
   * `handleChange` from `ToggleButtonGroup`
   * is the SyntheticEvent object, but we are
   * not using it in this example so we will omit it.
   */
  const handleChange = (val) => setValue(val);

  var current = props.myRef.current;

  return (
    <>
      {
        //show={props.paymentSuccess}
        <button className="btn btn-secondary" onClick={props.openTheModal}>
          Invoice{" "}
        </button>
      }

      <Modal
        show={props.paymentSuccess}
        onHide={props.closePaymentSuccessmodal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton></Modal.Header>

        <Modal.Body>
          <div className=" d-flex justify-content-center">
            <div className="row text-center">
              <div className="col-12">
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  size="3x"
                  color="green"
                  className="mb-3"
                />

                <h3 className="text-success">Sale Completed</h3>
              </div>

              <div className="col-12 mt-3">
                <ReactToPrint
                  copyStyles={true}
                  trigger={() => {
                    // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
                    // to the root node of the returned component as it will be overwritten.
                    return (
                      <Button variant="primary" className="mr-1">
                        <FontAwesomeIcon icon={faPrint} className="mr-1" />
                        Print Receipt
                      </Button>
                    );
                  }}
                  content={() => componentRef.current}
                />

                <Button variant="secondary" onClick={props.restartCart}>
                  New Sale
                </Button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <div className="d-none">
        <div ref={componentRef}>
          <Reciept
            cartobj={props.cartobj}
            qty={props.qty}
            product_type={props.product_type}
            total_price={props.total_price}
            discount={props.discount}
            fees={props.fees}
            original_amount={props.original_amount}
            customer_name={props.customer_name}
            vat={props.vat}
            allAmount={props.allAmount}
            changes={props.changes}
            order_id={props.order_id}
            billing={props.billing}
            couponliststatus={props.couponliststatus}
            coupon={props.coupon}
            taxpercent={props.taxpercent}
            number={props.number}
          />
        </div>
      </div>
    </>
  );
});
