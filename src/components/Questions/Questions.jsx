import SearchFields from "../SearchFields/SearchFields";
import "./questions.css";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { FieldContext } from "../../context/FieldContext";

function Questions() {
    const { formState } = useContext(FieldContext);
    const navigateTo = useNavigate();
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
            <SearchFields />
            <div className="mt-3 text-center">
                <button className="btn btn-outline-primary col-md-5" onClick={(event) => handleSubmit(event)}>
                    Submit
                </button>
            </div>
        </div>
    );
}

export default Questions;
