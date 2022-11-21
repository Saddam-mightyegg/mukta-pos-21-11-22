import React, { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Col from "react-bootstrap/Col";
var th_item = [
  "Item",
  "Description",
  "Size",
  "Colour",
  "Quantity",
  "Unit Price",
  "Vat",
  "Total Price",
];

const date_format = new Date();
const date_only = ("0" + date_format.getDate()).slice(-2);
const first_date = date_only[0];
const second_date = date_only[1];
const year_number = date_format.getFullYear();
var months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];
const month_name = months[date_format.getMonth()];
export const Reciept = (props) => {
  const [scanning, setScanning] = useState(false);
  // console.log("props check")
  console.log(props);
  var taxitem = parseFloat(props.taxpercent) / 100;

  var unitprice = 0;
  var vattotoal = 0;
  var subtitall = 0;
  return (
    <>
      <div
        className="pdf_section font-weight-bold"
        ref={props.ref}
        id="capture"
      >
        <table className="iteem ">
          <thead>
            <tr>
              <td>
                <div class="header-space">&nbsp;</div>
              </td>
            </tr>
          </thead>
          <tbody className="fixedyop ">
            <tr>
              <td>
                <div id="pageHost" class="content mt-2">
                  <div className=" pdf_body  ">
                    {
                      //         <div className = "invoice_title playfair">
                      // Invoice No.
                      // </div>
                      // <div className = " invoice_no lora mb-2">
                      //     {props.order_id}
                      // </div>
                    }

                    <div className="  pdf_invoice  float-left">
                      <span className="border-in">IN</span>VOICE
                    </div>

                    <div className="float-right">
                      <table class=" invoice-section table table-bordered">
                        <thead>
                          <th>Invoice no</th>
                          <th>Serial no</th>
                        </thead>

                        <tbody>
                          <tr>
                            <td className="text-center">{props.order_id}</td>
                            <td class="text-center">{props.number}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div classname="mt-5 pdf-table">
                      <table className=" text-center">
                        <thead className="mt-5 header1 playfair">
                          {Array.from(th_item).map((data, index) => {
                            return (
                              <th
                                colspan={
                                  index === th_item.length - 1 ? "1" : "1"
                                }
                                className={
                                  index === th_item.length - 1
                                    ? "total_ptice word-wrap"
                                    : "word-wrap"
                                }
                              >
                                {data}
                              </th>
                            );
                          })}
                        </thead>
                        {props.cartobj.map((item, idx) => {
                          var ret = item.short_description.replace("<p>", "");
                          ret = ret.replace("</p>", "");
                          var fullname = item.name + " " + ret;
                          console.log(item.price);
                          var vatamount = parseFloat(item.price) * taxitem;
                          var vatamount1 = vatamount * props.qty[idx];
                          var actual_price = parseFloat(item.price) + vatamount;
                          unitprice =
                            parseFloat(item.price) * props.qty[idx] + unitprice;
                          vattotoal = vatamount1 + vattotoal;
                          subtitall = actual_price * props.qty[idx] + subtitall;
                          return (
                            <tr>
                              <td className="content-td">
                                <span className="info">{idx + 1}</span>
                              </td>

                              <td className="content-td">
                                <span className="info">{fullname}</span>
                              </td>

                              <td className="content-td">
                                <span className="info">
                                  {props.product_type[idx]
                                    ? props.product_type[idx]["Size"]
                                    : ""}
                                </span>
                              </td>

                              <td className="content-td">
                                <span className="info">
                                  {props.product_type[idx]
                                    ? props.product_type[idx]["Colour"]
                                    : ""}
                                </span>
                              </td>

                              <td className="content-td">
                                <span className="info">{props.qty[idx]}</span>
                              </td>

                              <td className="content-td">
                                <span className="info">
                                  {item.price * props.qty[idx]}
                                </span>
                              </td>
                              <td className="content-td">
                                <span className="info">
                                  {vatamount1.toFixed()}
                                </span>
                              </td>

                              <td className="total_price_dark content-td">
                                <span>{actual_price * props.qty[idx]}</span>
                              </td>
                            </tr>
                          );
                        })}

                        <tbody className="page-break">
                          <tr className="subtotal  fees word-wrap">
                            <td>
                              <span>{}</span>
                            </td>

                            <td>
                              <span>{""}</span>
                            </td>
                            <td>
                              <span>{}</span>
                            </td>

                            <td>
                              <span>{}</span>
                            </td>

                            <td className="content-td">
                              <span className="info">{"Sub-Total"}</span>
                            </td>
                            <td>
                              <span>{unitprice}</span>
                            </td>

                            <td>
                              <span>{vattotoal}</span>
                            </td>

                            <td className="total_price ">
                              <span>{subtitall}</span>
                            </td>
                          </tr>

                          <tr className="spacer">
                            <td>
                              <span>{}</span>
                            </td>

                            <td>
                              <span>{""}</span>
                            </td>
                            <td>
                              <span>{}</span>
                            </td>

                            <td>
                              <span>{}</span>
                            </td>

                            <td>
                              <span>{}</span>
                            </td>

                            <td>
                              <span></span>
                            </td>

                            <td className="">
                              <span></span>
                            </td>

                            <td className="">
                              <span></span>
                            </td>
                          </tr>

                          {
                            // <tr className = "vat playfair">
                            //     <td><span>{}</span></td>
                            //     <td><span>{""}</span></td>
                            //     <td><span>{}</span></td>
                            //     <td><span>{}</span></td>
                            //     <td><span>{}</span></td>
                            //             <td><span>{}</span></td>
                            //     <td><span>{"VAT"}</span></td>
                            //     <td className = "total_price"><span>{props.vat}</span></td>
                            //     </tr>
                          }

                          <tr className="page-break discount playfair">
                            <td>
                              <span>{}</span>
                            </td>

                            <td>
                              <span>{""}</span>
                            </td>
                            <td>
                              <span>{}</span>
                            </td>

                            <td>
                              <span>{}</span>
                            </td>

                            <td>
                              <span>{}</span>
                            </td>
                            <td>
                              <span>{}</span>
                            </td>

                            <td>
                              <span>{"Discount"}</span>
                            </td>

                            <td className="total_price">
                              <span>{props.discount}</span>
                            </td>
                          </tr>
                          <tr className="vat playfair">
                            <td>
                              <span>{}</span>
                            </td>

                            <td>
                              <span>{""}</span>
                            </td>
                            <td>
                              <span>{}</span>
                            </td>

                            <td>
                              <span>{}</span>
                            </td>

                            <td>
                              <span>{}</span>
                            </td>
                            <td>
                              <span>{}</span>
                            </td>

                            <td>
                              <span>{"Fees"}</span>
                            </td>

                            <td className="total_price">
                              <span>{props.fees}</span>
                            </td>
                          </tr>

                          {props.couponliststatus &&
                            props.coupon.map((item, idx) => (
                              <tr className="vat playfair">
                                <td>
                                  <span>{}</span>
                                </td>

                                <td>
                                  <span>{""}</span>
                                </td>
                                <td>
                                  <span>{}</span>
                                </td>

                                <td>
                                  <span>{}</span>
                                </td>

                                <td>
                                  <span>{}</span>
                                </td>

                                <td>
                                  <span>{item["code"]}</span>
                                </td>

                                <td className="total_price">
                                  <span>{item["amount"]}</span>
                                </td>
                              </tr>
                            ))}

                          <tr className="fees playfair">
                            <td>
                              <span>{}</span>
                            </td>

                            <td>
                              <span>{}</span>
                            </td>

                            <td>
                              <span>{""}</span>
                            </td>
                            <td>
                              <span>{}</span>
                            </td>

                            <td>
                              <span>{}</span>
                            </td>

                            <td>
                              <span>{}</span>
                            </td>

                            <td>
                              <span>{"Total"}</span>
                            </td>

                            <td className="total_price" colspan="2">
                              <span>{props.total_price}</span>
                            </td>
                            {/* <td className = ""><span>00</span></td> */}
                          </tr>
                          <tr className="spacer">
                            <td>
                              <span>{}</span>
                            </td>

                            <td>
                              <span>{""}</span>
                            </td>
                            <td>
                              <span>{}</span>
                            </td>

                            <td>
                              <span>{}</span>
                            </td>

                            <td>
                              <span>{}</span>
                            </td>
                            <td>
                              <span>{}</span>
                            </td>

                            <td>
                              <span>{}</span>
                            </td>

                            <td class="float-right"></td>
                          </tr>

                          <tr className="spacer">
                            <td>
                              <span>{}</span>
                            </td>

                            <td>
                              <span>{""}</span>
                            </td>
                            <td>
                              <span>{}</span>
                            </td>

                            <td>
                              <span>{}</span>
                            </td>

                            <td>
                              <span>{}</span>
                            </td>
                            <td>
                              <span>{}</span>
                            </td>

                            <td>
                              <span>{}</span>
                            </td>

                            <td class=" mode_title font-weight-bold">
                              <span>Mode of Payment</span>
                            </td>
                          </tr>

                          <tr className="vat cash playfair">
                            <td>
                              <span>{}</span>
                            </td>

                            <td>
                              <span>{""}</span>
                            </td>
                            <td>
                              <span>{}</span>
                            </td>

                            <td>
                              <span>{}</span>
                            </td>

                            <td>
                              <span>{}</span>
                            </td>
                            <td>
                              <span>{}</span>
                            </td>

                            <td>
                              <span>{"Cash"}</span>
                            </td>

                            <td className="total_price" colspan="2">
                              <span>{props.allAmount[1]}</span>
                            </td>
                            {/* <td className = ""><span>00</span></td> */}
                          </tr>
                          <tr className="vat playfair">
                            <td>
                              <span>{}</span>
                            </td>

                            <td>
                              <span>{""}</span>
                            </td>
                            <td>
                              <span>{}</span>
                            </td>

                            <td>
                              <span>{}</span>
                            </td>

                            <td>
                              <span>{}</span>
                            </td>
                            <td>
                              <span>{}</span>
                            </td>

                            <td>
                              <span>{"Card"}</span>
                            </td>

                            <td className="total_price" colspan="2">
                              <span>{props.allAmount[2]}</span>
                            </td>
                            {/* <td className = ""><span>00</span></td> */}
                          </tr>
                          <tr className="vat playfair">
                            <td>
                              <span>{}</span>
                            </td>

                            <td>
                              <span>{""}</span>
                            </td>
                            <td>
                              <span>{}</span>
                            </td>

                            <td>
                              <span>{}</span>
                            </td>

                            <td>
                              <span>{}</span>
                            </td>
                            <td>
                              <span>{}</span>
                            </td>

                            <td>
                              <span>{"Wallet"}</span>
                            </td>

                            <td className="total_price" colspan="2">
                              <span>{props.allAmount[3]}</span>
                            </td>
                            {/* <td className = ""><span>00</span></td> */}
                          </tr>

                          <tr className=" fees playfair">
                            <td>
                              <span>{}</span>
                            </td>

                            <td>
                              <span>{""}</span>
                            </td>
                            <td>
                              <span>{}</span>
                            </td>

                            <td>
                              <span>{}</span>
                            </td>

                            <td>
                              <span>{}</span>
                            </td>
                            <td>
                              <span>{}</span>
                            </td>

                            <td>
                              <span>{"Change"}</span>
                            </td>

                            <td className="total_price">
                              <span>
                                {props.changes < 0 ? -props.changes : 0}
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="float-right billed ">
                      <p className="text-right billed_section playfair">
                        Billed To:
                      </p>
                      <p className="text-right billing_info">
                        {props.customer_name}
                      </p>

                      <p className="text-right billing_info">
                        {props.billing ? props.billing.address_1 : ""}
                      </p>

                      <p className="text-right billing_info">
                        {props.billing ? props.billing.address_2 : ""}
                      </p>

                      <p className="text-right billing_info">
                        {props.billing ? props.billing.city : ""}
                      </p>

                      <p className="text-right billing_info">
                        {props.billing ? props.billing.country : ""}
                      </p>

                      <p className="text-right billing_info">
                        {props.billing ? props.billing.phone : ""}
                      </p>
                      <p className="text-right billing_info">
                        {props.billing ? props.billing.email : ""}
                      </p>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td>
                <div class="footer-space">&nbsp;</div>
              </td>
            </tr>
          </tfoot>
        </table>
        <header id="pageHeader ">
          <div className="pdf_header">
            <div className="row section">
              <div className="pdf_logo col-3">
                <img src="https://www.muktaofficial.com/wp-content/uploads/2020/07/MUKTA-logo.png" />
              </div>
              <div className="pdf_invoice  col-5">
                {/* <span className = "border-in">IN</span>VOICE */}
              </div>

              <div className="pdf_date col-4 float-right">
                <div className="date-section">
                  <div className="row date  pl-4 playfair">DATE</div>

                  <div className="row  text-center ">
                    <div className="date-group ">
                      <div className="date_border date_1">
                        <div className=" no-row">
                          <Col className=" date_format border-right">
                            {first_date}
                          </Col>
                          <Col className=" date_format">{second_date}</Col>
                        </div>

                        <div className="date-format-label">DAY</div>
                      </div>
                    </div>
                    <div className="date-group  ">
                      <div className="date_border date_2">
                        <div className="date_format">{month_name}</div>
                        <div className="date-format-label">MONTH</div>
                      </div>
                    </div>
                    <div className="date-group ">
                      <div className="date_border date_3">
                        <div className="date_format">{year_number}</div>
                        <div className="date-format-label ">YEAR</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        <footer id="pageFooter">
          <div class="pdf_footer">
            <div className=" text-white  pdf_left col-4 float-left">
              <p class="tax-title">MUSAK 6.3</p>
              <p>BIN: 002615886-010</p>
            </div>
            <div className=" pr-5 float-right">
              <div className="thank-note  text-right text-white ">
                THANK YOU!
              </div>
              <div className="float-right contact playfair">
                <p className="text-right ">Visit Us at</p>
                <p className="text-right ">www.muktaofficial.com</p>
              </div>
            </div>
            <div class="numberOfPages"></div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Reciept;
