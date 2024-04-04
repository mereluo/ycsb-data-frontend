import React, { useContext } from "react";
import { FieldContext } from "../../context/FieldContext";
import { Input, Select, Option, Typography } from "@mui/joy";
import "./form.css";

function DBForm({ isUpload }) {
    const requiredField = `card-text${isUpload ? " required" : ""}`;

    const { handleDbChange } = useContext(FieldContext);
    return (
        <div className="row">
            <div className="card border-bottom-0 border-top-0 col">
                <Typography className="card-header" color="primary" level="title-md" variant="soft">
                    1. Database Configurations
                </Typography>
                <div className="card-body">
                    <div className="row">
                        <div className="col">
                            <p className={requiredField}>Enter Database</p>
                            <Input variant="outlined" color="neutral" size="sm" type="text" className="form-control" id="textInput" placeholder="E.g., Spanner" onChange={(e) => handleDbChange("database", e.target.value.toLowerCase())} required={isUpload} />
                        </div>
                        <div className="col">
                            <p className="card-text">Description</p>
                            <Input variant="outlined" color="neutral" size="sm" type="text" id="description-input" className="form-control" onChange={(e) => handleDbChange("description", e.target.value)} />
                        </div>
                        <div className="col">
                            <p className="card-text">Platform</p>
                            <Input variant="outlined" color="neutral" size="sm" type="text" id="platform-input" className="form-control " onChange={(e) => handleDbChange("platform", e.target.value)} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <p className={`${requiredField} mt-4`}>Test Type</p>
                            <div className="form-group">
                                <Select id="typeSelect" onChange={(e, val) => handleDbChange("type", val)} required={isUpload}>
                                    <Option value="ycsb">YCSB</Option>
                                    <Option value="ycsb-t">YCSB-T</Option>
                                    <Option value="ycsb-r">YCSB-R</Option>
                                </Select>
                            </div>
                        </div>
                        <div className="col">
                            <p className={`${requiredField} mt-4`}>Number of Nodes</p>
                            <Input variant="outlined" color="neutral" size="sm" type="number" id="number-input" className="form-control " onChange={(e) => handleDbChange("numOfNodes", Math.max(1000, e.target.value))} min="1000" required={isUpload} />
                        </div>
                        <div className="col">
                            <p className={`${requiredField} mt-4`}>Single/Multiple</p>
                            <Select id="multiRegionSelect" onChange={(e, val) => handleDbChange("isMultiRegional", val)} required={isUpload}>
                                <Option value="single">Single Region</Option>
                                <Option value="multiple">Multiple Regions</Option>
                            </Select>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-4">
                            <p className={requiredField}>Client/Database Colocated?</p>
                            <div className="form-group">
                                <Select id="locateSelect" onChange={(e, val) => handleDbChange("isCoLocated", val)} required={isUpload}>
                                    <Option value="true">True</Option>
                                    <Option value="false">False</Option>
                                </Select>
                            </div>
                        </div>
                        <div className="col">
                            <p className="card-text">Location Details</p>
                            <Input variant="outlined" color="neutral" size="sm" type="text" id="description-input" className="form-control" placeholder="E.g., Client: Oregon, Lead: Los Angeles" onChange={(e) => handleDbChange("locationDetails", e.target.value)} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DBForm;
