import { useState } from "react";
import Papa from "papaparse";
import { TSTemplate } from "../../models/TimeSeries";
import AForYCSB from "../Workloads/AForYCSB";

function Upload() {
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
        isMultiRegional: null,
        isCoLocated: null,
        locationDetails: "",
        description: "",

        database: "",
    });

    const [data, setData] = useState(null);

    const handleInputChange = (fieldName, value) => {
        setFormState((prevState) => ({ ...prevState, [fieldName]: value }));
    };
    const handleDataChange = (setData, fieldName, value) => {
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
            setFormState((prevState) => ({ ...prevState, userDefinedFields: data }));
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
                                <div className="col-4">
                                    <p className="card-text">Single or Multiple</p>
                                    <select className="form-select" id="multiRegionSelect" onChange={(e) => handleInputChange("isMultiRegional", e.target.value)}>
                                        <option value="false">Single Region</option>
                                        <option value="true">Multiple Regions</option>
                                    </select>
                                </div>
                                <div className="col">
                                    <p className="card-text">Locations for client and lead database</p>
                                    <input type="text" id="description-input" className="form-control" placeholder="E.g., Client: Oregon, Lead: Los Angeles" onChange={(e) => handleInputChange("description", e.target.value)} />
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
            <div>
                <div className="row">
                    <div className="card col-9 mt-3">
                        <div className="card-header">5. Workload Data</div>
                        {formState.workloadType === "A" && <AForYCSB handleDataChange={handleDataChange} validateDoubleInput={validateDoubleInput} setData={setData} numberPattern={numberPattern} />}
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
