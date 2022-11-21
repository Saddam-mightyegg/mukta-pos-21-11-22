import React, { useState, useRef } from "react";
import Scanner from "./Scanner";
import Result from "./Result";

const MainApp = (props) => {
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState("No result");
  const scannerRef = useRef(null);

  return (
    <div>
      <ul className="">
        <div className="row">
          <div classNamw="col-8">
            <input className="form-control" value={results} />
          </div>

          <div classNamw="col-4">
            <button
              className="btn btn-primary active"
              onClick={() => props.getTheCode(results)}
            >
              Confirm
            </button>
          </div>
        </div>
      </ul>

      <button onClick={() => setScanning(!scanning)}>
        {scanning ? "Stop" : "Start"}
      </button>

      <div ref={scannerRef} style={{ position: "relative" }}>
        {/* <video style={{ width: window.innerWidth, height: 480, border: '3px solid orange' }}/> */}
        <canvas
          className="drawingBuffer"
          style={{
            position: "absolute",
            top: "0px",
            // left: '0px',
            // height: '100%',
            // width: '100%',
          }}
          width="640"
          height="480"
        />
        {scanning ? (
          <Scanner
            scannerRef={scannerRef}
            onDetected={(result) => setResults(result)}
          />
        ) : null}
      </div>
    </div>
  );
};

export default MainApp;
