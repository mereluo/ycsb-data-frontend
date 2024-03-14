import { TSTemplate } from "../../models/Templates";
import { useContext, useState } from "react";
import { FieldContext } from "../../context/FieldContext";
import WorkloadFactory from "../Workload/WorkloadFactory";
import Form from "../Form/Form";
import UploadResult from "./UploadResult";

function Upload() {
    const { formState, handleTimeSeriesUpload } = useContext(FieldContext);
    const [submissionResult, setSubmissionResult] = useState(null);
    const [tablesHidden, setTablesHidden] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const entity = await fetch(`http://localhost:8080/api/workload/save`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formState),
            });
            const result = await entity.json();
            setSubmissionResult(result);
            setTablesHidden(false);
            console.log("Workload created: ", result);
        } catch (error) {
            console.error("Error creating workload: ", error);
            setSubmissionResult({
                error: "Failed to create workload. Please try again.",
                details: error,
            });
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
            <div className="mt-3">
                <h2 className="mb-2">Upload Data</h2>
                <p className="lead">Fill in the required fields and (Optional) upload the time series data as CSV.</p>
            </div>
            <form onSubmit={(event) => handleSubmit(event)}>
                <Form isUpload={true} />
                <div className="row">
                    <div className="card col-9 mt-3 mr-3">
                        <div className="card-header">5. Workload Data</div>
                        {formState.workloadType && formState.type && <WorkloadFactory type={formState.workloadType} test={formState.type} />}
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
                <div className="mt-3 text-center">
                    <button className="btn btn-outline-primary col-md-5" type="submit">
                        Submit
                    </button>
                </div>
            </form>
            <div className="mt-3 text-center">
                <UploadResult formState={formState} submissionResult={submissionResult} setSubmissionResult={setSubmissionResult} setTablesHidden={setTablesHidden} tablesHidden={tablesHidden} />
            </div>
        </div>
    );
}

export default Upload;
