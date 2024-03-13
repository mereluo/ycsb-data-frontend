import Form from "../Form/Form";
import "./search.css";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { FieldContext } from "../../context/FieldContext";

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
            const entity = await fetch(`http://localhost:8080/api/workload/search`, {
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
            }
        } catch (error) {
            console.error("Error finding workloadA: ", error);
        }
    };

    return (
        <div className="container">
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
