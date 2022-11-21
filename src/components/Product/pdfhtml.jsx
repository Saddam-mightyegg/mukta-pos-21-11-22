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
function ggg() {
  const input = document.querySelector("#capture");

  html2canvas(input, { useCORS: true }).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(imgData, "JPEG", 0, 0);
    pdf.save("download.pdf");
  });
}

export const Pdfhtml = (props) => {
  const [scanning, setScanning] = useState(false);
  // console.log("props check")
  // console.log(props)

  return (
    <>
      <div id="capture" className="row">
        <div id=" ">
          <div className="pdf_header">
            <div className="row section">
              <div className="pdf_logo col-3">
                <img src="https://www.muktaofficial.com/wp-content/uploads/2020/07/MUKTA-logo.png" />
              </div>
              <div className="pdf_invoice text-white col-3">
                {/* <span className = "border-in">IN</span>VOICE */}
              </div>

              <div className="pdf_date col-5">
                <div className="date-section">
                  <div className="row date text-white pl-4 playfair">DATE</div>

                  <div className="row  text-center ">
                    <div className="date-group col">
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
                    <div className="date-group col ">
                      <div className="date_border date_2">
                        <div className="date_format">{month_name}</div>
                        <div className="date-format-label">MONTH</div>
                      </div>
                    </div>
                    <div className="date-group col">
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
        </div>
      </div>

      <button className="bu" onClick={() => ggg()}>
        123
      </button>
    </>
  );
};

export default Pdfhtml;
