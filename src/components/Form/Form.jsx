import React, { useContext } from "react";
import { FieldContext } from "../../context/FieldContext";
import { Input, Select, Option, Typography } from "@mui/joy";
import "./form.css";

function Form({ isUpload }) {
    const requiredField = `card-text${isUpload ? " required" : ""}`;

    const { handleInputChange, validateDoubleInput, numberPattern } = useContext(FieldContext);
    return (
        <div className="question-container mt-2">
            <div className="row">
                <div className="card border-bottom-0 border-top-0 col mr-3">
                    <Typography className="card-header" color="primary" level="title-md" variant="soft">
                        1. Database Option
                    </Typography>
                    <div className="card-body">
                        <div className="form-group">
                            <p className={requiredField}>Enter Database</p>
                            <Input variant="outlined" color="neutral" size="sm" type="text" className="form-control" id="textInput" placeholder="E.g., Spanner" onChange={(e) => handleInputChange("database", e.target.value.toLowerCase())} required={isUpload} />
                        </div>
                    </div>
                    <Typography className="card-header" color="primary" level="title-md" variant="soft">
                        2. Database Configurations
                    </Typography>
                    <div className="card-body">
                        <div className="row">
                            <div className="col">
                                <p className="card-text">Description</p>
                                <Input variant="outlined" color="neutral" size="sm" type="text" id="description-input" className="form-control" onChange={(e) => handleInputChange("description", e.target.value)} />
                            </div>
                            <div className="col">
                                <p className="card-text">Platform</p>
                                <Input variant="outlined" color="neutral" size="sm" type="text" id="platform-input" className="form-control " onChange={(e) => handleInputChange("platform", e.target.value)} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <p className={`${requiredField} mt-4`}>Test Type</p>
                                <div className="form-group">
                                    <Select id="typeSelect" onChange={(e, val) => handleInputChange("type", val)} required={isUpload}>
                                        <Option value="ycsb">YCSB</Option>
                                        <Option value="ycsb-t">YCSB-T</Option>
                                        <Option value="ycsb-r">YCSB-R</Option>
                                    </Select>
                                </div>
                            </div>
                            <div className="col">
                                <p className={`${requiredField} mt-4`}>Number of Nodes</p>
                                <Input variant="outlined" color="neutral" size="sm" type="number" id="number-input" className="form-control " onChange={(e) => handleInputChange("numOfNodes", Math.max(1000, e.target.value))} min="1000" required={isUpload} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <p className={requiredField}>Single or Multiple</p>
                                <Select id="multiRegionSelect" onChange={(e, val) => handleInputChange("isMultiRegional", val)} required={isUpload}>
                                    <Option value="single">Single Region</Option>
                                    <Option value="multiple">Multiple Regions</Option>
                                </Select>
                            </div>
                            <div className="col">
                                <p className={requiredField}>Client and DB Colocated?</p>
                                <div className="form-group">
                                    <Select id="locateSelect" onChange={(e, val) => handleInputChange("isCoLocated", val)} required={isUpload}>
                                        <Option value="true">True</Option>
                                        <Option value="false">False</Option>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <p className="card-text">Locations for client and lead database</p>
                        <Input variant="outlined" color="neutral" size="sm" type="text" id="description-input" className="form-control" placeholder="E.g., Client: Oregon, Lead: Los Angeles" onChange={(e) => handleInputChange("locationDetails", e.target.value)} />
                    </div>
                </div>

                <div className="card border-bottom-0 border-top-0 col">
                    <Typography className="card-header" color="primary" level="title-md" variant="soft">
                        3. Test Configuration
                    </Typography>
                    <div className="card-body">
                        <div className="row">
                            <div className="col">
                                <p className={requiredField}>Concurrency Level</p>
                                <Input variant="outlined" color="neutral" size="sm" type="number" id="concurrencySelect" className="form-control" onChange={(e) => handleInputChange("concurrencyLevel", Math.max(1, e.target.value))} required={isUpload} />
                            </div>
                            <div className="col">
                                <p className={requiredField}>Record Counts (in Million)</p>
                                <Input variant="outlined" color="neutral" size="sm" type="text" id="Record-input" className="form-control" onChange={(e) => handleInputChange("recordCounts", validateDoubleInput(e.target.value))} pattern={numberPattern} required={isUpload} />
                            </div>
                        </div>
                        <p className="card-text">Command Line</p>
                        <Input variant="outlined" color="neutral" size="sm" type="text" id="command-line-input" className="form-control col" onChange={(e) => handleInputChange("commandLine", e.target.value)} />
                    </div>

                    <Typography className="card-header" color="primary" level="title-md" variant="soft">
                        4. Workload Option
                    </Typography>
                    <div className="card-body">
                        <div className="row">
                            <div className="col">
                                <p className={requiredField}>Update Type</p>
                                <Select id="multiRegionSelect" onChange={(e, val) => handleInputChange("updateType", val)} required={isUpload}>
                                    <Option value="query">by query</Option>
                                    <Option value="buffer">by buffer</Option>
                                </Select>
                            </div>
                            <div className="col">
                                <p className={requiredField}>Workload Type</p>
                                <Input variant="outlined" color="neutral" size="sm" type="text" id="workloadType-input" className="form-control" placeholder="E.g., A" onChange={(e) => handleInputChange("workloadType", e.target.value)} required={isUpload} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Form;
