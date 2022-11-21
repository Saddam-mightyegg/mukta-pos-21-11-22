import React, { useState } from "react";
import BarCodeScanner from "barcode-react-scanner";

const TestingComponent = (props): JSX.Element => {
  const [code, setCode] = useState("");
  const [start, setStart] = useState(true);

  return (
    <>
      <div classNamw="col-8">
        <input className="form-control" value={code} />
      </div>

      <div classNamw="col-4">
        <button
          className="btn btn-primary active"
          onClick={() => {
            setStart(false);
            props.getTheCode(code);
            props.closeTheModal();
          }}
        >
          Confirm
        </button>
      </div>

      {start && (
        <BarCodeScanner
          onUpdate={(err, resp): void => {
            if (resp) {
              setStart(false);

              setCode(resp.getText());

              setStart(true);
            }
          }}
        />
      )}
    </>
  );
};

export default TestingComponent;
