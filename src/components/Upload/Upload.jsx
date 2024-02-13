import { useState } from "react";
import Papa from "papaparse";
import { TSTemplate } from "../../models/Workload";

function Upload() {
    const DBOption = [
        { id: 1, label: "Spanner" },
        { id: 2, label: "CockroachDB" },
        { id: 3, label: "MongoDB" },
    ];
    const numberPattern = "[0-9]+([.][0-9]+)?";
    const [formState, setFormState] = useState({
        workloadType: "",
        updateType: "",
        userDefinedFields: null,
        timeSeries: null,

        concurrencyLevel: null,
        recordCounts: null,
        commandLine: "",

        type: "",
        platform: "",
        numOfNodes: null,
        numOfRegions: null,
        description: "",

        database: "",
    });

    const [data, setData] = useState(null);

    const handleInputChange = (fieldName, value) => {
        setFormState((prevState) => ({ ...prevState, [fieldName]: value }));
    };
    const handleDataChange = (fieldName, value) => {
        setData((prevState) => ({ ...prevState, [fieldName]: value }));
    };

    function validateDoubleInput(input) {
        // Validate if the input is a valid double
        const parsedValue = parseFloat(input);
        return isNaN(parsedValue) ? 1 : Math.max(0, parsedValue);
    }

    const handleTimeSeriesUpload = (event) => {
        // Handle the uploaded file here
        const file = event.target.files[0];
        if (file) {
            Papa.parse(event.target.files[0], {
                header: true,
                skipEmptyLines: true,
                complete: function (results) {
                    const inputData = results.data;
                    const resultObject = {};

                    inputData.forEach((item) => {
                        const { category, time, mean_latency } = item;
                        if (!resultObject[category]) {
                            resultObject[category] = {
                                time: [],
                                latency: [],
                            };
                        }
                        resultObject[category].time.push(time);
                        resultObject[category].latency.push(mean_latency);
                    });
                    const finalResult = {
                        data: resultObject,
                    };
                    setFormState((prevState) => ({ ...prevState, ["timeSeries"]: finalResult }));
                },
            });
        }
    };

    const handleSubmit = async () => {
        try {
            const entity = await fetch(`http://localhost:8080/api/workload/save`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formState),
            });
            const result = await entity.json();
            console.log("Workload created: ", result);
        } catch (error) {
            console.error("Error creating workload: ", error);
        }
    };

    const handleDownload = () => {
        const createTemplate = (template, filename) => {
            const blob = new Blob([template], { type: "text/csv" });

            // Create a URL for the Blob
            const url = window.URL.createObjectURL(blob);

            // Create a temporary anchor element to trigger the download
            const a = document.createElement("a");
            a.href = url;
            a.download = filename + ".csv";
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        };
        createTemplate(TSTemplate, "time-series");
    };

    return (
        <div className="container">
            <div className="mt-2 ">
                <h2>Upload data</h2>
                <p>Fill in all the fields and upload the time series data as CSV.</p>
            </div>
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
                                    <input type="text" id="platform-input" className="form-control " onChange={(e) => handleInputChange("numOfRegions", e.target.value)} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
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
                                    <input type="number" id="number-input" className="form-control " onChange={(e) => handleInputChange("numOfNodes", Math.max(1, e.target.value))} min="1" />
                                </div>
                                <div className="col">
                                    <p className="card-text">Number of Regions</p>
                                    <input type="number" id="number-input" className="form-control " onChange={(e) => handleInputChange("numOfNodes", Math.max(1, e.target.value))} min="1" />
                                </div>
                            </div>
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
                                    <input type="text" id="update-input" className="form-control" onChange={(e) => handleInputChange("updateType", e.target.value)} />
                                </div>
                                <div className="col">
                                    <p className="card-text">Workload Type</p>
                                    <input type="text" id="workloadType-input" className="form-control" onChange={(e) => handleInputChange("workloadType", e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div className="row">
                    <div className="card col-9 mt-3">
                        <div className="card-header">5. Workload Data</div>
                        <div className="card-body col">
                            <p className="card-text">Operations per Second</p>
                            <input type="text" id="opsPerSec-input" className="form-control col-3" onChange={(e) => handleDataChange("opsPerSec", validateDoubleInput(e.target.value))} pattern={numberPattern} />
                            <div className="row">
                                <div className="col-3">
                                    <p className="card-text">Read Mean Latency</p>
                                    <input type="text" id="readMeanLatency" className="form-control " onChange={(e) => handleDataChange("readMeanLatency", validateDoubleInput(e.target.value))} pattern={numberPattern} />
                                </div>

                                <div className="col-3">
                                    <p className="card-text">Read Max Latency</p>
                                    <input type="text" id="readMaxLatency" className="form-control " onChange={(e) => handleDataChange("readMaxLatency", validateDoubleInput(e.target.value))} pattern={numberPattern} />
                                </div>
                                <div className="col-3">
                                    <p className="card-text">Read Percentile 95</p>
                                    <input type="text" id="readP95" className="form-control " onChange={(e) => handleDataChange("readP95", validateDoubleInput(e.target.value))} pattern={numberPattern} />
                                </div>

                                <div className="col-3">
                                    <p className="card-text">Read Percentile 99</p>
                                    <input type="text" id="readP99" className="form-control " onChange={(e) => handleDataChange("readP99", validateDoubleInput(e.target.value))} pattern={numberPattern} />
                                </div>
                            </div>
                        </div>

                        {(formState.workloadType === "B" || formState.workloadType === "A") && (
                            <div className="card-body row">
                                <div className="col-3">
                                    <p className="card-text">Update Mean Latency</p>
                                    <input type="text" id="updateMeanLatency" className="form-control " onChange={(e) => handleInputChange("updateMeanLatency", validateDoubleInput(e.target.value))} pattern={numberPattern} />
                                </div>
                                <div className="col-3">
                                    <p className="card-text">Update Max Latency</p>
                                    <input type="text" id="updateMaxLatency" className="form-control " onChange={(e) => handleInputChange("updateMaxLatency", validateDoubleInput(e.target.value))} pattern={numberPattern} />
                                </div>
                                <div className="col-3">
                                    <p className="card-text">Update Percentile 95</p>
                                    <input type="text" id="updateP95" className="form-control " onChange={(e) => handleInputChange("updateP95", validateDoubleInput(e.target.value))} pattern={numberPattern} />
                                </div>
                                <div className="col-3">
                                    <p className="card-text">Update Percentile 99</p>
                                    <input type="text" id="updateP99" className="form-control " onChange={(e) => handleInputChange("updateP99", validateDoubleInput(e.target.value))} pattern={numberPattern} />
                                </div>
                            </div>
                        )}

                        {formState.workloadType === "F" && (
                            <div className="card-body row">
                                <div className="col-3">
                                    <p className="card-text">RMW Mean Latency</p>
                                    <input type="text" id="rmwMeanLatency" className="form-control " onChange={(e) => handleInputChange("rmwMeanLatency", validateDoubleInput(e.target.value))} pattern={numberPattern} />
                                </div>
                                <div className="col-3">
                                    <p className="card-text">RMW Max Latency</p>
                                    <input type="text" id="rmwMaxLatency" className="form-control " onChange={(e) => handleInputChange("rmwMaxLatency", validateDoubleInput(e.target.value))} pattern={numberPattern} />
                                </div>
                                <div className="col-3">
                                    <p className="card-text">RMW Percentile 95</p>
                                    <input type="text" id="rmwP95" className="form-control " onChange={(e) => handleInputChange("rmwP95", validateDoubleInput(e.target.value))} pattern={numberPattern} />
                                </div>
                                <div className="col-3">
                                    <p className="card-text">RMW Percentile 99</p>
                                    <input type="text" id="rmwP99" className="form-control " onChange={(e) => handleInputChange("rmwP99", validateDoubleInput(e.target.value))} pattern={numberPattern} />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="card col mt-3">
                        <div className="card-header">6. Upload Time Series CSV</div>
                        <div className="mt-4">
                            <p>Download CSV Template</p>
                            <button className="btn btn-outline-info p-3" onClick={handleDownload}>
                                Download Template
                            </button>
                        </div>
                        <div className="custom-file mt-5">
                            <input type="file" className="custom-file-input" id="csvFile" accept=".csv" onChange={handleTimeSeriesUpload} />
                            <label className="custom-file-label" htmlFor="csvFile">
                                Choose file
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-3 text-center">
                <button className="btn btn-outline-primary col-md-5" onClick={(event) => handleSubmit(event)}>
                    Submit
                </button>
            </div>
        </div>
    );
}

export default Upload;
