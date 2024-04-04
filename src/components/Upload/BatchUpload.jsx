import { useState, useContext, useEffect } from "react";
import { FieldContext } from "../../context/FieldContext";
import DBForm from "../Form/DBForm";
import TestForm from "../Form/TestForm";
import UploadResult from "./SingleResult";
import { Typography, Button, CircularProgress } from "@mui/joy";
import ServerPath from "../../context/ServerPath";

function BatchUpload() {
    const { DBState, setDBState, workloadList, setWorkloadList } = useContext(FieldContext);
    const [submissionResult, setSubmissionResult] = useState(null);
    const [tablesHidden, setTablesHidden] = useState(false);
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
        // setLoading(true);
        console.log(DBState);
        console.log(workloadList);
        // try {
        //     const entity = await fetch(`${ServerPath}/api/workload/save`, {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //         body: JSON.stringify(formState),
        //     });
        //     const result = await entity.json();
        //     console.log("result: ", result);
        //     setSubmissionResult(result);
        //     setTablesHidden(false);
        //     setLoading(false);
        // } catch (error) {
        //     console.error("Error creating workload: ", error);
        //     setSubmissionResult({
        //         error: "Failed to create workload. Please try again.",
        //         details: error,
        //     });
        // }
    };
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
        <div>
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
            {/* <div className="mt-3 text-center">
                <UploadResult formState={formState} submissionResult={submissionResult} setSubmissionResult={setSubmissionResult} setTablesHidden={setTablesHidden} tablesHidden={tablesHidden} />
            </div> */}
        </div>
    );
}

export default BatchUpload;
