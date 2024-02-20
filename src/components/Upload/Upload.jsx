import { TSTemplate } from "../../models/Templates";
import WorkloadFactory from "../Workload/WorkloadFactory";
import SearchFields from "../SearchFields/SearchFields";
import { useContext } from "react";
import { FieldContext } from "../../context/FieldContext";

function Upload() {
    const { formState, setFormState, handleTimeSeriesUpload } = useContext(FieldContext);
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
            <div className="row">
                <div className="card col-9 mt-3">
                    <div className="card-header">5. Workload Data</div>
                    {formState.workloadType && <WorkloadFactory type={formState.workloadType} test={formState.type} />}
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
                <button className="btn btn-outline-primary col-md-5" onClick={(event) => handleSubmit(event)}>
                    Submit
                </button>
            </div>
        </div>
    );
}

export default Upload;
