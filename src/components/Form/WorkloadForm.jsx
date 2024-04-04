import { useContext } from "react";
import { TSTemplate } from "../../models/Templates";
import WorkloadFactory from "./Workload/WorkloadFactory";
import { FieldContext } from "../../context/FieldContext";
import { Typography } from "@mui/joy";

function WorkloadForm() {
    const { DBState, handleTimeSeriesUpload } = useContext(FieldContext);
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
        <div className="row">
            <div className="card border-bottom-0 border-top-0 col-9 mr-3">
                <Typography className="card-header" color="primary" level="title-md" variant="soft">
                    3. Workload Data
                </Typography>
                {DBState.workloadType && DBState.type && <WorkloadFactory type={DBState.workloadType} test={DBState.type} />}
            </div>
            <div className="card border-bottom-0 border-top-0 col">
                <Typography className="card-header" color="primary" level="title-md" variant="soft">
                    4. Upload Time Series CSV
                </Typography>
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
    );
}

export default WorkloadForm;
