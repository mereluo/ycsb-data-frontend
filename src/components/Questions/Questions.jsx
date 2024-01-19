import { useState } from "react";
import "./questions.css";
import { useNavigate } from "react-router-dom";

function Questions() {
    const DBOption = [
        { id: 1, label: "Spanner" },
        { id: 2, label: "CockroachDB" },
        { id: 3, label: "MongoDB" },
    ];
    const navigateTo = useNavigate();

    const [formState, setFormState] = useState({
        concurrencyLevel: null,
        recordCounts: null,
        commandLine: "",
        isTransactional: null,
        platform: "",
        numOfNodes: null,
        isMultiRegion: null,
        numOfRegions: null,
        description: "",
        database: "",
        type: "",
    });

    const handleInputChange = (fieldName, value) => {
        setFormState((prevState) => ({ ...prevState, [fieldName]: value }));
        if (fieldName == "isMultiRegion" && !value) {
            setFormState((prevState) => ({ ...prevState, ["numOfRegions"]: 1 }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(formState);
        const workloadType = formState.type;
        try {
            const entity = await fetch(`http://localhost:8080/api/workload${workloadType}/retrieve`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formState),
            });
            const workloadA = await entity.json();
            console.log("WorkloadA requested: ", workloadA);
            navigateTo("/result", { state: { workload: workloadA } });
        } catch (error) {
            console.error("Error finding workloadA: ", error);
        }
    };

    return (
        <div className="question-container mt-2">
            <div className="row">
                <div className="card text-center col mr-3">
                    <div className="card-header">Database Options</div>

                    <div className="card-body">
                        <div className="form-check">
                            {DBOption.map((item) => (
                                <div key={item.id}>
                                    <input className="form-check-input" type="radio" name="databaseOptions" id={`databaseOption${item.id}`} value={item.label} onChange={() => handleInputChange("database", item.label)} />
                                    <label className="form-check-label" htmlFor={`databaseOption${item.id}`}>
                                        {item.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="card-header">Database Configuration</div>

                    <div className="card-body">
                        <div className="row">
                            <div className="col">
                                <p className="card-text">Description</p>
                                <input type="text" id="description-input" className="form-control col" onChange={(e) => handleInputChange("description", e.target.value)} />
                            </div>
                            <div className="col">
                                <p className="card-text mt-2">Platform</p>
                                <input type="text" id="platform-input" className="form-control col" onChange={(e) => handleInputChange("platform", e.target.value)} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <p className="card-text">Is Transactional</p>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1" onChange={() => handleInputChange("isTransactional", true)} />
                                    <label className="form-check-label" htmlFor="inlineRadio1">
                                        Yes (YCSB+T)
                                    </label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2" onChange={() => handleInputChange("isTransactional", false)} />
                                    <label className="form-check-label" htmlFor="inlineRadio2">
                                        No
                                    </label>
                                </div>
                            </div>

                            <div className="col">
                                <p className="card-text">Number of Nodes</p>
                                <input type="number" id="number-input" className="form-control " onChange={(e) => handleInputChange("numOfNodes", Math.max(1, e.target.value))} min="1" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col mt-3">
                                <p className="card-text">Is Multi-regional</p>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" name="isMultiRegion" value="true" onChange={() => handleInputChange("isMultiRegion", true)} />
                                    <label className="form-check-label" htmlFor="isMultiRegion1">
                                        Yes
                                    </label>
                                </div>

                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" name="isMultiRegion" value="false" onChange={() => handleInputChange("isMultiRegion", false)} />
                                    <label className="form-check-label" htmlFor="isMultiRegion2">
                                        No
                                    </label>
                                </div>
                            </div>
                            {formState.isMultiRegion && (
                                <div className="col">
                                    <p className="card-text">Number of regions</p>
                                    <input type="number" id="number-input" className="form-control " onChange={(e) => handleInputChange("numOfRegions", Math.max(1, e.target.value))} min="1" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="card text-center col">
                    <div className="card-header">Test Configuration</div>

                    <div className="card-body">
                        <p className="card-text">Concurrency Level</p>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="concurrencyOptions" id="inlineRadio1" value="option1" onChange={() => handleInputChange("concurrencyLevel", 64)} />
                            <label className="form-check-label" htmlFor="inlineRadio1">
                                64
                            </label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="concurrencyOptions" id="inlineRadio2" value="option2" onChange={() => handleInputChange("concurrencyLevel", 128)} />
                            <label className="form-check-label" htmlFor="inlineRadio2">
                                128
                            </label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="concurrencyOptions" id="inlineRadio3" value="option3" onChange={() => handleInputChange("concurrencyLevel", 256)} />
                            <label className="form-check-label" htmlFor="inlineRadio2">
                                256
                            </label>
                        </div>

                        <div className="row">
                            <div className="col">
                                <p className="card-text">Record Counts</p>
                                <input type="number" id="number-input" className="form-control" onChange={(e) => handleInputChange("recordCounts", Math.max(1, e.target.value))} min="1" />
                            </div>
                            <div className="col">
                                <p className="card-text">Command Line</p>
                                <input type="text" id="command-line-input" className="form-control col" onChange={(e) => handleInputChange("commandLine", e.target.value)} />
                            </div>
                        </div>
                    </div>

                    <div className="card-header">Workload Option</div>

                    <div className="card-body">
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="workloadOptions" id="inlineRadio1" value="A" onChange={() => handleInputChange("type", "A")} />
                            <label className="form-check-label" htmlFor="inlineRadio1">
                                Workload A
                            </label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="workloadOptions" id="inlineRadio2" value="B" onChange={() => handleInputChange("type", "B")} />
                            <label className="form-check-label" htmlFor="inlineRadio2">
                                Workload B
                            </label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="workloadOptions" id="inlineRadio3" value="C" onChange={() => handleInputChange("type", "F")} />
                            <label className="form-check-label" htmlFor="inlineRadio2">
                                Workload F
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-3 text-center">
                <button className="btn btn-outline-primary col-md-5" onClick={(event) => handleSubmit(event)}>
                    Submit
                </button>
            </div>
        </div>
    );
}

export default Questions;
