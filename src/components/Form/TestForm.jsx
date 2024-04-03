import React, { useContext } from "react";
import { FieldContext } from "../../context/FieldContext";
import { Input, Select, Option, Typography } from "@mui/joy";
import "./form.css";
import TxtForm from "./TxtForm";

function TestForm({ id, isUpload, isBatch }) {
    const requiredField = `card-text${isUpload ? " required" : ""}`;

    const { handleInputChange, validateDoubleInput, numberPattern } = useContext(FieldContext);
    return (
        <div className="row">
            <div className={`card border-bottom-0 border-top-0 mb-2 ${isBatch ? "" : "mt-2"}`}>
                <Typography className="card-header" color="primary" level="title-md" variant="soft">
                    {isBatch ? "Test Configuration" : "2. Test Configuration"}
                </Typography>
                <div className="card-body">
                    <div className="row">
                        <div className="col-2">
                            <p className={requiredField}>Concurrency Level</p>
                            <Input variant="outlined" color="neutral" size="sm" type="number" id="concurrencySelect" className="form-control" onChange={(e) => handleInputChange("concurrencyLevel", Math.max(1, e.target.value))} required={isUpload} />
                        </div>
                        <div className="col-2">
                            <p className={requiredField}>Record Counts(Million)</p>
                            <Input variant="outlined" color="neutral" size="sm" type="text" id="Record-input" className="form-control" onChange={(e) => handleInputChange("recordCounts", validateDoubleInput(e.target.value))} pattern={numberPattern} required={isUpload} />
                        </div>
                        <div className="col-2">
                            <p className={requiredField}>Update Type</p>
                            <Select id="multiRegionSelect" onChange={(e, val) => handleInputChange("updateType", val)} required={isUpload}>
                                <Option value="query">by query</Option>
                                <Option value="buffer">by buffer</Option>
                            </Select>
                        </div>
                        <div className="col-2">
                            <p className={requiredField}>Workload Type</p>
                            <Input variant="outlined" color="neutral" size="sm" type="text" id="workloadType-input" className="form-control" placeholder="E.g., A" onChange={(e) => handleInputChange("workloadType", e.target.value)} required={isUpload} />
                        </div>
                        <div className="col-3">
                            <p className="card-text">Command Line</p>
                            <Input variant="outlined" color="neutral" size="sm" type="text" id="command-line-input" className="form-control col" onChange={(e) => handleInputChange("commandLine", e.target.value)} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-4 mt-4">{isBatch && <TxtForm id={id} />}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TestForm;
