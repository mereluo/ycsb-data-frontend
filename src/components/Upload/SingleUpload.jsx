import { useContext, useState, useEffect } from "react";
import { FieldContext } from "../../context/FieldContext";
import DBForm from "../Form/DBForm";
import TestForm from "../Form/TestForm";
import WorkloadForm from "../Form/WorkloadForm";
import UploadResult from "./SingleResult";
import { Typography, Button, CircularProgress } from "@mui/joy";
import ServerPath from "../../context/ServerPath";

function SingleUpload() {
    const { formState, setFormState } = useContext(FieldContext);
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
        console.log(formState);
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
                <div className="question-container mt-2">
                    <DBForm isUpload={true} />
                    <TestForm isUpload={true} isBatch={false} />
                    <WorkloadForm />
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
