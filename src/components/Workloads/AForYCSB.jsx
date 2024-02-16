import React from "react";

function AForYCSB({ handleDataChange, validateDoubleInput, setData, numberPattern }) {
    return (
        <div>
            <div className="card-body">
                <p className="card-text">Operations per Second</p>
                <input type="text" id="opsPerSec-input" className="form-control col-3" onChange={(e) => handleDataChange(setData, "opsPerSec", validateDoubleInput(e.target.value))} pattern={numberPattern} />
                <div className="row">
                    <div className="col-3">
                        <p className="card-text">Read Mean Latency</p>
                        <input type="text" id="readMeanLatency" className="form-control " onChange={(e) => handleDataChange(setData, "readMeanLatency", validateDoubleInput(e.target.value))} pattern={numberPattern} />
                    </div>

                    <div className="col-3">
                        <p className="card-text">Read Max Latency</p>
                        <input type="text" id="readMaxLatency" className="form-control " onChange={(e) => handleDataChange(setData, "readMaxLatency", validateDoubleInput(e.target.value))} pattern={numberPattern} />
                    </div>
                    <div className="col-3">
                        <p className="card-text">Read Percentile 95</p>
                        <input type="text" id="readP95" className="form-control " onChange={(e) => handleDataChange(setData, "readP95", validateDoubleInput(e.target.value))} pattern={numberPattern} />
                    </div>

                    <div className="col-3">
                        <p className="card-text">Read Percentile 99</p>
                        <input type="text" id="readP99" className="form-control " onChange={(e) => handleDataChange(setData, "readP99", validateDoubleInput(e.target.value))} pattern={numberPattern} />
                    </div>
                </div>

                <div className="row">
                    <div className="col-3">
                        <p className="card-text">Update Mean Latency</p>
                        <input type="text" id="updateMeanLatency" className="form-control " onChange={(e) => handleDataChange(setData, "updateMeanLatency", validateDoubleInput(e.target.value))} pattern={numberPattern} />
                    </div>
                    <div className="col-3">
                        <p className="card-text">Update Max Latency</p>
                        <input type="text" id="updateMaxLatency" className="form-control " onChange={(e) => handleDataChange(setData, "updateMaxLatency", validateDoubleInput(e.target.value))} pattern={numberPattern} />
                    </div>
                    <div className="col-3">
                        <p className="card-text">Update Percentile 95</p>
                        <input type="text" id="updateP95" className="form-control " onChange={(e) => handleDataChange(setData, "updateP95", validateDoubleInput(e.target.value))} pattern={numberPattern} />
                    </div>
                    <div className="col-3">
                        <p className="card-text">Update Percentile 99</p>
                        <input type="text" id="updateP99" className="form-control " onChange={(e) => handleDataChange(setData, "updateP99", validateDoubleInput(e.target.value))} pattern={numberPattern} />
                    </div>
                </div>
          