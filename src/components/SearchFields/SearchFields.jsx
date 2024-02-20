import React, { useContext } from "react";
import { FieldContext } from "../../context/FieldContext";

function SearchFields() {
    const { handleInputChange } = useContext(FieldContext);
    return (
        <div className="question-container mt-2">
            <div className="row">
                <div className="card col mr-3">
                    <div className="card-header">1. Database Option</div>
                    <div className="card-body">
                        <div className="form-group">
                            <label htmlFor="textInput">Enter Database</label>
                            <input type="text" className="form-control" id="textInput" placeholder="E.g., Spanner" onChange={(e) => handleInputChange("database", e.target.value)} />
                        </div>
                    </div>
                    <div className="card-header">2. Database Configurations</div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col">
                                <p className="card-text">Description</p>
                                <input type="text" id="description-input" className="form-control" onChange={(e) => handleInputChange("description", e.target.value)} />
                            </div>
                            <div className="col">
                                <p className="card-text mt-2">Platform</p>
                                <input type="text" id="platform-input" className="form-control " onChange={(e) => handleInputChange("platform", e.target.value)} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-4">
                                <p className="card-text">Test Type</p>
                                <div className="form-group">
                                    <select className="form-select" id="typeSelect" onChange={(e) => handleInputChange("type", e.target.value)}>
                                        <option value="ycsb">YCSB</option>
                                        <option value="ycsb-t">YCSB-T</option>
                                        <option value="ycsb-r">YCSB-R</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col">
                                <p className="card-text">Number of Nodes</p>
                                <input type="number" id="number-input" className="form-control " onChange={(e) => handleInputChange("numOfNodes", Math.max(1000, e.target.value))} min="1000" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <p className="card-text">Single or Multiple</p>
                                <select className="form-select" id="multiRegionSelect" onChange={(e) => handleInputChange("multiRegional", e.target.value)}>
                                    <option value="false">Single Region</option>
                                    <option value="true">Multiple Regions</option>
                                </select>
                            </div>
                            <div className="col">
                                <p className="card-text">Client and DB Colocated?</p>
                                <div className="form-group">
                                    <select className="form-select" id="locateSelect" onChange={(e) => handleInputChange("coLocated", e.target.value)}>
                                        <option value="true">True</option>
                                        <option value="false">False</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <p className="card-text">Locations for client and lead database</p>
                        <input type="text" id="description-input" className="form-control" placeholder="E.g., Client: Oregon, Lead: Los Angeles" onChange={(e) => handleInputChange("description", e.target.value)} />
                    </div>
                </div>

                <div className="card col">
                    <div className="card-header">3. Test Configuration</div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col">
                                <p className="card-text">Concurrency Level</p>
                                <div className="form-group">
                                    <select className="form-select" id="concurrencySelect" onChange={(e) => handleInputChange("concurrencyLevel", e.target.value)}>
                                        <option value="64">64</option>
                                        <option value="128">128</option>
                                        <option value="256">256</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col">
                                <p className="card-text">Record Counts</p>
                                <input type="number" id="number-input" className="form-control" onChange={(e) => handleInputChange("recordCounts", Math.max(1, e.target.value))} min="1" />
                            </div>
                        </div>
                        <p className="card-text">Command Line</p>
                        <input type="text" id="command-line-input" className="form-control col" onChange={(e) => handleInputChange("commandLine", e.target.value)} />
                    </div>

                    <div className="card-header">4. Workload Option</div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col">
                                <p className="card-text">Update Type</p>
                                <select className="form-select" id="multiRegionSelect" onChange={(e) => handleInputChange("updateType", e.target.value)}>
                                    <option value="query">by query</option>
                                    <option value="buffer">by buffer</option>
                                </select>
                            </div>
                            <div className="col">
                                <p className="card-text">Workload Type</p>
                                <input type="text" id="workloadType-input" className="form-control" placeholder="E.g., A" onChange={(e) => handleInputChange("workloadType", e.target.value)} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchFields;
