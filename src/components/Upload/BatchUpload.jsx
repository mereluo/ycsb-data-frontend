import { useState, useContext, useEffect } from "react";
import { FieldContext } from "../../context/FieldContext";
import DBForm from "../Form/DbForm";
import TestForm from "../Form/TestForm";
import WorkloadForm from "../Form/WorkloadForm";
import UploadResult from "./SingleResult";
import { Typography, Button, CircularProgress } from "@mui/joy";
import ServerPath from "../../context/ServerPath";

function BatchUpload() {
    const [userDefinedFields, setUserDefinedFields] = useState(null);
    const [rawContent, setRawContent] = useState("");
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

    const handleFileUpload = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        const reader = new FileReader();

        const chunkSize = 30 * 1024; // 10KB
        let fileContent = "";

        reader.onload = async (event) => {
            const content = event.target.result;
            fileContent += content;
            setRawContent((prevContent) => prevContent + content);

            // Continue reading next chunk
            if (file.size > reader.offset) {
                const blob = file.slice(reader.offset, reader.offset + chunkSize);
                reader.readAsText(blob);
            } else {
                // Extract user-defined fields
                const extractedData = extractUserDefinedFields(fileContent);

                setUserDefinedFields(reformatUserDefinedFields(extractedData));
            }
        };

        // Read the first chunk
        const blob = file.slice(0, chunkSize);
        reader.readAsText(blob);
    };

    const extractUserDefinedFields = (fileContent) => {
        const lines = fileContent.split("\n");
        const extractedData = {};

        lines.forEach((line) => {
            const matches = line.match(/\[(.*?)\], (.*?), (\d+(?:\.\d+)?)/);
            if (matches) {
                const [, field, operation, value] = matches;
                if (!field.includes("-FAILED") && (operation === "AverageLatency(us)" || operation === "MaxLatency(us)" || operation === "MinLatency(us)" || operation === "95thPercentileLatency(us)" || operation === "99thPercentileLatency(us)" || (field === "OVERALL" && operation === "Throughput(ops/sec)"))) {
                    // field name preprocessing
                    const words = field.split(" ");
                    let formatField = words[0].toLowerCase();
                    for (let i = 1; i < words.length; i++) {
                        formatField += words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
                    }
                    if (formatField === "read-modify-write") formatField = "rmw";
                    if (!extractedData[formatField]) {
                        extractedData[formatField] = {};
                    }
                    extractedData[formatField][operation] = parseFloat(value);
                }
            }
        });

        return extractedData;
    };

    const reformatUserDefinedFields = (originalData) => {
        const reformattedData = {};
        // Map original properties to the desired format
        Object.keys(originalData).forEach((key) => {
            const item = originalData[key];
            const prefix = key;

            Object.keys(item).forEach((subKey) => {
                let newKey = "";

                switch (subKey) {
                    case "Throughput(ops/sec)":
                        newKey = "opsPerSec";
                        break;
                    case "AverageLatency(us)":
                        newKey = `${prefix}MeanLatency`;
                        break;
                    case "MinLatency(us)":
                        newKey = `${prefix}MinLatency`;
                        break;
                    case "95thPercentileLatency(us)":
                        newKey = `${prefix}P95`;
                        break;
                    case "99thPercentileLatency(us)":
                        newKey = `${prefix}P99`;
                        break;
                    default:
                        break;
                }
                if (newKey) {
                    reformattedData[newKey] = item[subKey];
                }
            });
        });
        return reformattedData;
    };

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
    return (
        <div>
            <h2>Upload a text file</h2>
            <input type="file" onChange={(e) => handleFileUpload(e)} />
            {/* <div>
                <h3>File content:</h3>
                <pre>{rawContent}</pre>
            </div> */}
            {userDefinedFields && (
                <div>
                    <h3>User Defined Fields:</h3>
                    <pre>{JSON.stringify(userDefinedFields, null, 2)}</pre>
                </div>
            )}
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
                    <TestForm isUpload={true} />
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

export default BatchUpload;
