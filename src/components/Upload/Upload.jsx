import { TSTemplate } from "../../models/TimeSeries";
import AForYCSB from "../Workloads/AForYCSB";
import { FieldContext } from "../../context/FieldContext";
import SearchFields from "../SearchFields/SearchFields";
import { useContext } from "react";

function Upload() {
    const { formState, setFormState } = useContext(FieldContext);
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
            <SearchFields />
            <div>
                <div className="row">
                    <div className="card col-9 mt-3">
                        <div className="card-header">5. Workload Data</div>
                        {formState.workloadType === "A" && <AForYCSB />}
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
