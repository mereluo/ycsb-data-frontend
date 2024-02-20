import SearchFields from "../SearchFields/SearchFields";
import "./questions.css";
import { useNavigate } from "react-router-dom";

function Questions() {
    const { formState, setFormState } = useContext(FieldContext);
    const navigateTo = useNavigate();
    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(formState);
        const type = formState.workloadType;
        try {
            const entity = await fetch(`http://localhost:8080/api/workload${type}/retrieve`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formState),
            });
            const result = await entity.json();
            console.log("Workload requested: ", result);
            navigateTo("/result", { state: { workload: result } });
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
