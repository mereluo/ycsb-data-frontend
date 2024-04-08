import { useState, useContext, useEffect } from "react";
import { FieldContext } from "../../context/FieldContext";
import DBForm from "../Form/DBForm";
import TestForm from "../Form/TestForm";
import SingleResult from "./SingleResult";
import { Typography, Button, CircularProgress } from "@mui/joy";
import ServerPath from "../../context/ServerPath";

function BatchUpload() {
    const { DBState, setDBState, workloadList, setWorkloadList } = useContext(FieldContext);
    const [completeList, setCompleteList] = useState([]);
    const [submissionResult, setSubmissionResult] = useState([]);
    const [tablesHidden, setTablesHidden] = useState([]);
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(false);

    const [testFormList, setTestFormList] = useState([<TestForm key={0} id={0} isUpload={true} isBatch={true} />]);

    useEffect(() => {
        if (!mounted) {
            setDBState({});
        }
        setMounted(true);
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        const allWorkloads = workloadList.map((obj) => {
            return {
                ...DBState,
                ...obj,
            };
        });
        setCompleteList(allWorkloads);
        setSubmissionResult(Array(allWorkloads.length).fill(null));

        // Define an array to store promises for each API call
        const apiCalls = allWorkloads.map(async (item, index) => {
            try {
                const entity = await fetch(`${ServerPath}/api/workload/save`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(item),
                });
                const result = await entity.json();
                console.log("result for item", index, ": ", result);

                // Update submissionResult for each item
                setSubmissionResult((prevState) => [...prevState.slice(0, index), result, ...prevState.slice(index + 1)]);
            } catch (error) {
                console.error("Error creating workload for item", index, ": ", error);
                // Update submissionResult for error case
                setSubmissionResult((prevState) => [
                    ...prevState.slice(0, index),
                    {
                        error: "Failed to create workload. Please try again.",
                        details: error,
                    },
                    ...prevState.slice(index + 1),
                ]);
            }
        });

        // Execute all API calls concurrently
        await Promise.all(apiCalls);
        setLoading(false);
    };
    const addForm = () => {
        const newIndex = testFormList.length;
        setTestFormList([...testFormList, <TestForm key={newIndex} id={newIndex} isUpload={true} isBatch={true} />]);
        setTablesHidden(Array(newIndex).fill(false));
    };
    const deleteForm = () => {
        if (testFormList.length > 1) {
            const deleteIdx = testFormList.length - 1;
            setTestFormList(testFormList.filter((form, i) => i !== deleteIdx));
            setWorkloadList(workloadList.filter((workload, i) => i !== deleteIdx));
            setTablesHidden(tablesHidden.filter((obj, i) => i !== deleteIdx));
        }
    };

    return (
        <div>
            <div className="mt-3">
                <Typography color="neutral" level="h3" variant="plain" className="mb-2">
                    Upload Data
                </Typography>
                <Typography color="neutral" level="h4" variant="plain">
                    Fill in the required fields for database configurations
                </Typography>
            </div>
            <form onSubmit={(event) => handleSubmit(event)}>
                <div className="question-container mt-2">
                    <DBForm isUpload={true} />
                    <Typography color="neutral" level="h4" variant="plain">
                        Add Tests
                    </Typography>
                    {testFormList.map((form, index) => form)}
                    <Button className="col-md-2 mr-3" variant="soft" onClick={addForm}>
                        Add Another Workload
                    </Button>
                    <Button className="col-md-2" variant="soft" color="danger" onClick={deleteForm}>
                        Delete the Last Workload
                    </Button>
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
                <div className="mt-3 text-center">
                    {completeList.map((workload, index) => (
                        <SingleResult
                            key={index}
                            formState={workload}
                            submissionResult={submissionResult[index]} // Pass the correct submissionResult based on index
                            setTablesHidden={setTablesHidden}
                            tablesHidden={tablesHidden[index]} // Pass the correct tablesHidden based on index
                            index={index}
                        />
                    ))}
                </div>
            </form>
        </div>
    );
}

export default BatchUpload;
