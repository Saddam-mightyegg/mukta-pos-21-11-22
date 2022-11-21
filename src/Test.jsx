import React, { Component } from "react";
import BarcodeReader from "react-barcode-reader";

class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: "No result",
    };

    this.handleScan = this.handleScan.bind(this);
  }
  handleScan(data) {
    console.log("dataaaaaaaaaaaaaaaaaaa");
    console.log(data);

    this.setState({
      result: data,
    });
  }

  handleScanButtonLongPressed = () => {
    //alert("complete")
  };
  handleError(err) {
    console.error("error");

    console.error(err);
  }

  checkBarCode = (e) => {
    console.log("gggggggggggggggg");
    console.log(e);
  };

  render() {
    return (
      <div>
        <BarcodeReader
          onError={this.handleError}
          onScan={this.handleScan}
          onScanButtonLongPressed={this.handleScanButtonLongPressed}
          onReceive={this.handleScanButtonLongPressed}
        />
        <p>{this.state.result}</p>
        <input />
      </div>
    );
  }
}

export default Test;
