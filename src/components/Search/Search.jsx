import Form from "../Form/Form";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { FieldContext } from "../../context/FieldContext";
import { Typography } from "@mui/joy";

function Search() {
    const { formState, setFormState } = useContext(FieldContext);
    const navigateTo = useNavigate();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (!mounted) {
            setFormState({});
        }
        setMounted(true);
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const entity = await fetch(`https://ycsb-nosql.onrender.com/api/workload/search`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formState),
            });
            const result = await entity.json();
            console.log("Workload requested: ", result);
            if (result.length !== 0) {
                navigateTo("/result", { state: { workload: result } });
            } else {
                alert("No matching workload found. Please try again.");
            }
        } catch (error) {
            console.error("Error finding workloadA: ", error);
        }
    };

    return (
        <div className="container">
            <div className="mt-3">
                <Typography color="neutral" level="h3" variant="plain" className="mb-2">
                    Search for Workloads
                </Typography>
                <Typography color="neutral" level="body-md" variant="soft">
                    All the fields below are not required.{" "}
                </Typography>
                <Typography color="neutral" level="body-md" variant="soft" className="lead">
                    (e.g., if you specify nothing and submit, all workloads will be shown in the result).
                </Typography>
            </div>
            <Form isUpload={false} />
            <div className="mt-3 text-center">
                <button className="btn btn-outline-primary col-md-5" onClick={(event) => handleSubmit(event)}>
                    Submit
                </button>
            </div>
        </div>
    );
}

export default Search;
