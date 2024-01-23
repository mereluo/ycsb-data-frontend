import { useState, useEffect } from "react";
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
        concurrencyLevel: null,
        recordCounts: null,
        commandLine: "",
        transactional: null,
        platform: "",

        numOfNodes: null,
        multiRegion: null,
        numOfRegions: null,
        description: "",

        database: "",
        workloadType: "",

        timeSeries: null,
        opsPerSec: null,
        readMeanLatency: null,
        readMaxLatency: null,
        readP95: null,
        readP99: null,

        updateMeanLatency: null,
        updateMaxLatency: null,
        updateP95: null,
        updateP99: null,

        rmwMeanLatency: null,
        rmwMaxLatency: null,
        rmwP95: null,
        rmwP99: null,
    });

    const handleInputChange = (fieldName, value) => {
        setFormState((prevState) => ({ ...prevState, [fieldName]: value }));
        if (fieldName == "isMultiRegion" && !value) {
            setFormState((prevState) => ({ ...prevState, ["numOfRegions"]: 1 }));
        }
    };

    function validateDoubleInput(input) {
        // Validate if the input is a valid double
        const parsedValue = parseFloat(input);
        return isNaN(parsedValue) ? 1 : Math.max(0, parsedValue);
    }

    const handleUpload = (event) => {
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
                    console.log(finalResult);
                    setFormState((prevState) => ({ ...prevState, ["timeSeries"]: finalResult }));
                },
            });
        }
    };

    const handleSubmit = async () => {
        const type = formState.workloadType;
        const fetchPath = type.toUpperCase();
        try {
            const entity = await fetch(`http://localhost:8080/api/workload${fetchPath}/save`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formState),
            });
            const result = await entity.json();
            console.log("Workload created: ", result);
        } catch (error) {
            console.error("Error creating workloadA: ", error);
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
                <p>Fill in all the required fields and upload the time series data as CSV.</p>
            </div>
            <div className="question-container mt-2">
                <div className="row">
                    <div className="card text-center col mr-3">
                        <div className="card-header">1. Database Options</div>

                        <div className="card-body">
                            <div className="form-check">
                                {DBOption.map((item) => (
                                    <div key={item.id}>
                                        <input className="form-check-input" type="radio" name="databaseOptions" id={`databaseOption${item.id}`} value={item.label} onChange={() => handleInputChange("database", item.label)} />
                                        <label className="form-check-label" htmlFor={`databaseOption${item.id}`}>
                                            {item.label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="card-header">2. Database Configuration</div>

                        <div className="card-body">
                            <div className="row">
                                <div className="col">
                                    <p className="card-text">Description</p>
                                    <input type="text" id="description-input" className="form-control col" onChange={(e) => handleInputChange("description", e.target.value)} />
                                </div>
                                <div className="col">
                                    <p className="card-text mt-2">Platform</p>
                                    <input type="text" id="platform-input" className="form-control col" onChange={(e) => handleInputChange("platform", e.target.value)} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <p className="card-text">Is Transactional</p>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" name="transactional" id="isTransactional" value="option1" onChange={() => handleInputChange("transactional", true)} />
                                        <label className="form-check-label" htmlFor="isTransactional">
                                            Yes (YCSB+T)
                                        </label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" name="transactional" id="notTransactional" value="option2" onChange={() => handleInputChange("transactional", false)} />
                                        <label className="form-check-label" htmlFor="notTransactional">
                                            No
                                        </label>
                                    </div>
                                </div>

                                <div className="col">
                                    <p className="card-text">Number of Nodes</p>
                                    <input type="number" id="number-input" className="form-control " onChange={(e) => handleInputChange("numOfNodes", Math.max(1, e.target.value))} min="1" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col mt-3">
                                    <p className="card-text">Is Multi-regional</p>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" name="isMultiRegion" value="true" onChange={() => handleInputChange("multiRegion", true)} />
                                        <label className="form-check-label" htmlFor="isMultiRegion1">
                                            Yes
                                        </label>
                                    </div>

                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" name="isMultiRegion" value="false" onChange={() => handleInputChange("multiRegion", false)} />
                                        <label className="form-check-label" htmlFor="isMultiRegion2">
                                            No
                                        </label>
                                    </div>
                                </div>
                                {formState.isMultiRegion && (
                                    <div className="col">
                                        <p className="card-text">Number of regions</p>
                                        <input type="number" id="number-input" className="form-control " onChange={(e) => handleInputChange("numOfRegions", Math.max(1, e.target.value))} min="1" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="card text-center col">
                        <div className="card-header">3. Test Configuration</div>

                        <div className="card-body">
                            <p className="card-text">Concurrency Level</p>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="concurrencyOptions" id="concurrency64" value="64" onChange={() => handleInputChange("concurrencyLevel", 64)} />
                                <label className="form-check-label" htmlFor="concurrency64">
                                    64
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="concurrencyOptions" id="concurrency128" value="128" onChange={() => handleInputChange("concurrencyLevel", 128)} />
                                <label className="form-check-label" htmlFor="concurrency128">
                                    128
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="concurrencyOptions" id="concurrency256" value="256" onChange={() => handleInputChange("concurrencyLevel", 256)} />
                                <label className="form-check-label" htmlFor="concurrency256">
                                    256
                                </label>
                            </div>

                            <div className="row">
                                <div className="col">
                                    <p className="card-text">Record Counts</p>
                                    <input type="number" id="number-input" className="form-control" onChange={(e) => handleInputChange("recordCounts", Math.max(1, e.target.value))} min="1" />
                                </div>
                                <div className="col">
                                    <p className="card-text">Command Line</p>
                                    <input type="text" id="command-line-input" className="form-control col" onChange={(e) => handleInputChange("commandLine", e.target.value)} />
                                </div>
                            </div>
                        </div>

                        <div className="card-header">4. Workload Option</div>

                        <div className="card-body">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="workloadOptions" id="workloadA" value="A" onChange={() => handleInputChange("workloadType", "A")} />
                                <label className="form-check-label" htmlFor="workloadA">
                                    Workload A
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="workloadOptions" id="workloadB" value="B" onChange={() => handleInputChange("workloadType", "B")} />
                                <label className="form-check-label" htmlFor="workloadB">
                                    Workload B
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="workloadOptions" id="workloadF" value="C" onChange={() => handleInputChange("workloadType", "F")} />
                                <label className="form-check-label" htmlFor="workloadF">
                                    Workload F
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div className="row">
                    <div className="card text-center col-9 mt-3">
                        <div className="card-header">5. Workload Data</div>
                        <div className="card-body col">
                            <p className="card-text">Operations per Second</p>
                            <input type="text" id="opsPerSec-input" className="form-control col-3" onChange={(e) => handleInputChange("opsPerSec", validateDoubleInput(e.target.value))} pattern={numberPattern} />
                            <div className="row">
                                <div className="col-3">
                                    <p className="card-text">Read Mean Latency</p>
                                    <input type="text" id="readMeanLatency" className="form-control " onChange={(e) => handleInputChange("readMeanLatency", validateDoubleInput(e.target.value))} pattern={numberPattern} />
                                </div>

                                <div className="col-3">
                                    <p className="card-text">Read Max Latency</p>
                                    <input type="text" id="readMaxLatency" className="form-control " onChange={(e) => handleInputChange("readMaxLatency", validateDoubleInput(e.target.value))} pattern={numberPattern} />
                                </div>
                                <div className="col-3">
                                    <p className="card-text">Read Percentile 95</p>
                                    <input type="text" id="readP95" className="form-control " onChange={(e) => handleInputChange("readP95", validateDoubleInput(e.target.value))} pattern={numberPattern} />
                                </div>

                                <div className="col-3">
                                    <p className="card-text">Read Percentile 99</p>
                                    <input type="text" id="readP99" className="form-control " onChange={(e) => handleInputChange("readP99", validateDoubleInput(e.target.value))} pattern={numberPattern} />
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
                            <input type="file" className="custom-file-input" id="csvFile" accept=".csv" onChange={handleUpload} />
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
