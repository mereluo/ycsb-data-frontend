import { useState, useContext, useEffect, useMemo } from "react";
import { FieldContext } from "../../context/FieldContext";
import DBForm from "../Form/DBForm";
import TestForm from "../Form/TestForm";
import SingleResult from "./SingleResult";
import { Typography, Button, CircularProgress } from "@mui/joy";
import ServerPath from "../../context/ServerPath";

function BatchUpload() {
    const { DBState, setDBState, workloadList, setWorkloadList } = useContext(FieldContext);
    const [completeList, setCompleteList] = useState([]);
    const [workloadsId, setWorkloadsId] = useState([]);
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

    const handleSubmit = useMemo(
        () => async (event) => {
            event.preventDefault();
            setLoading(true);
            const allWorkloads = workloadList.map((obj) => {
                return {
                    ...DBState,
                    ...obj,
                };
            });
            setCompleteList(allWorkloads);
            const newWorkloadsId = Array(allWorkloads.length).fill(null);
            const newTablesHidden = Array(allWorkloads.length).fill(false);

            for (let index = 0; index < allWorkloads.length; index++) {
                try {
                    const item = allWorkloads[index];
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
                    newWorkloadsId[index] = result.id;
                } catch (error) {
                    console.error("Error creating workload for item", index, ": ", error);
                    // Update submissionResult for error case
                    newWorkloadsId[index] = {
                        error: "Failed to create workload. Please try again.",
                        details: error,
                    };
                }
            }
            setWorkloadsId(newWorkloadsId);
            setTablesHidden(newTablesHidden);
            setLoading(false);
        },
        [DBState, workloadList]
    );

    const renderResults = useMemo(() => {
        console.log(tablesHidden);
        return completeList.map((workload, index) => <SingleResult key={index} formState={workload} workloadId={workloadsId[index]} tablesHidden={tablesHidden[index]} setTablesHidden={setTablesHidden} index={index} />);
    }, [JSON.stringify(tablesHidden)]);

    const addForm = () => {
        const newIndex = testFormList.length;
        setTestFormList([...testFormList, <TestForm key={newIndex} id={newIndex} isUpload={true} isBatch={true} />]);
    };
    const deleteForm = () => {
        if (testFormList.length > 1) {
            const deleteIdx = testFormList.length - 1;
            setTestFormList(testFormList.filter((form, i) => i !== deleteIdx));
            setWorkloadList(workloadList.filter((workload, i) => i !== deleteIdx));
        }
    };

    return (
        <div className="container">
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
            </form>
            <div className="mt-3 text-center">{renderResults}</div>
        </div>
    );
}

export default BatchUpload;
