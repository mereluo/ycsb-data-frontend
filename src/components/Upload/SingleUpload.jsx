import { TSTemplate } from "../../models/Templates";
import { useContext, useState, useEffect } from "react";
import { FieldContext } from "../../context/FieldContext";
import WorkloadFactory from "../Workload/WorkloadFactory";
import Form from "../Form/Form";
import UploadResult from "./SingleResult";
import { Typography, Button, CircularProgress } from "@mui/joy";
import ServerPath from "../../context/ServerPath";

function SingleUpload() {
    const { formState, setFormState, handleTimeSeriesUpload } = useContext(FieldContext);
    const [submissionResult, setSubmissionResult] = useState(null);
    const [tablesHidden, setTablesHidden] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!mounted) {
            setFormState({});
        }
        setMounted(true);
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const entity = await fetch(`${ServerPath}/api/workload/save`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formState),
            });
            const result = await entity.json();
            setSubmissionResult(result);
            setTablesHidden(false);
            setLoading(false);
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
                <Typography color="neutral" level="h3" variant="plain" className="mb-2">
                    Upload Data
                </Typography>
                <Typography color="neutral" level="body-md" variant="soft">
                    Fill in the required fields and (Optional) upload the time series data as CSV.
                </Typography>
            </div>
            <form onSubmit={(event) => handleSubmit(event)}>
                <Form isUpload={true} />
                <div className="row">
                    <div className="card border-bottom-0 border-top-0 col-9 mt-3 mr-3">
                        <Typography className="card-header" color="primary" level="title-md" variant="soft">
                            5. Workload Data
                        </Typography>
                        {formState.workloadType && formState.type && <WorkloadFactory type={formState.workloadType} test={formState.type} />}
                    </div>
                    <div className="card border-bottom-0 border-top-0 col mt-3">
                        <Typography className="card-header" color="primary" level="title-md" variant="soft">
                            6. Upload Time Series CSV
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
                <div className="mt-3 text-center">
                    {loading ? (
                        <Button className="col-md-5" variant="outlined" startDecorator={<CircularProgress variant="solid" />}>
                            Loading…
                        </Button>
                    ) : (
                        <Button className="col-md-5" variant="outlined" type="submit">
                            Submit
                        </Button>
                    )}
                </div>
            </form>
            <div className="mt-3 text-center">
                <UploadResult formState={formState} submissionResult={submissionResult} setSubmissionResult={setSubmissionResult} setTablesHidden={setTablesHidden} tablesHidden={tablesHidden} />
            </div>
        </div>
    );
}

export default SingleUpload;
