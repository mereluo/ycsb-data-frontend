import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { FieldContext } from "../../context/FieldContext";
import { Typography, Button, CircularProgress } from "@mui/joy";
import ServerPath from "../../context/ServerPath";
import DBForm from "../Form/DBForm";
import TestForm from "../Form/TestForm";

function Search() {
    const { DBState, setDBState } = useContext(FieldContext);
    const navigateTo = useNavigate();
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!mounted) {
            setDBState({});
        }
        setMounted(true);
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(DBState);
        // try {
        //     setLoading(true);
        //     const entity = await fetch(`${ServerPath}/api/workload/search`, {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //         body: JSON.stringify(formState),
        //     });
        //     const result = await entity.json();
        //     console.log("Workload requested: ", result);
        //     setLoading(false);
        //     if (result.length !== 0) {
        //         navigateTo("/result", { state: { workload: result } });
        //     } else {
        //         alert("No matching workload found. Please try again.");
        //     }
        // } catch (error) {
        //     console.error("Error finding workloadA: ", error);
        // }
    };

    return (
        <div className="container">
            <div className="mt-3">
                <Typography color="neutral" level="h3" variant="plain" className="mb-2">
                    Search for Workloads
                </Typography>
                <Typography color="neutral" level="body-md" variant="soft">
                    All the fields below are not required. (e.g., if you specify nothing and submit, all workloads will be shown in the result).
                </Typography>
            </div>
            <div className="question-container mt-2">
                <DBForm isUpload={false} />
                <TestForm isUpload={false} isBatch={false} />
            </div>
            <div className="mt-3 text-center">
                {loading ? (
                    <Button className="col-md-5" variant="outlined" startDecorator={<CircularProgress variant="solid" />}>
                        Loading…
                    </Button>
                ) : (
                    <Button className="col-md-5" variant="outlined" onClick={(event) => handleSubmit(event)}>
                        Submit
                    </Button>
                )}
            </div>
        </div>
    );
}

export default Search;
