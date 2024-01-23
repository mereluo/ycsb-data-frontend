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
        transactional: null,
        platform: "",
        numOfNodes: null,
        multiRegion: null,
        numOfRegions: null,
        description: "",
        database: "",
        workloadType: "",
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
            <div className="question-container mt-2">
                <div className="mt-2 ">
                    <h2>Begin Search</h2>
                    <p>Please fill in the following fields and search for a specific dataset.</p>
                </div>
                <div className="row">
                    <div className="card col mr-3">
                        <div className="card-header">1. Database Options</div>

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
                        <div className="card-header">2. Database Configuration</div>

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
                                        <input className="form-check-input" type="radio" name="transactional" id="isTransactional" value="option1" onChange={() => handleInputChange("transactional", true)} />
                                        <label className="form-check-label" htmlFor="isTransactional">
                                            Yes (YCSB+T)
                                        </label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" name="transactional" id="notTransactional" value="option2" onChange={() => handleInputChange("transactional", false)} />
                                        <label className="form-check-label" htmlFor="notTransactional">
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
                                        <input className="form-check-input" type="radio" name="isMultiRegion" value="true" onChange={() => handleInputChange("multiRegion", true)} />
                                        <label className="form-check-label" htmlFor="isMultiRegion1">
                                            Yes
                                        </label>
                                    </div>

                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" name="isMultiRegion" value="false" onChange={() => handleInputChange("multiRegion", false)} />
                                        <label className="form-check-label" htmlFor="isMultiRegion2">
                                            No
                                        </label>
                                    </div>
                                </div>
                                {formState.multiRegion && (
                                    <div className="col">
                                        <p className="card-text">Number of regions</p>
                                        <input type="number" id="number-input" className="form-control " onChange={(e) => handleInputChange("numOfRegions", Math.max(1, e.target.value))} min="1" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="card col">
                        <div className="card-header">3. Test Configuration</div>

                        <div className="card-body">
                            <p className="card-text">Concurrency Level</p>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="concurrencyOptions" id="concurrency64" value="64" onChange={() => handleInputChange("concurrencyLevel", 64)} />
                                <label className="form-check-label" htmlFor="concurrency64">
                                    64
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="concurrencyOptions" id="concurrency128" value="128" onChange={() => handleInputChange("concurrencyLevel", 128)} />
                                <label className="form-check-label" htmlFor="concurrency128">
                                    128
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="concurrencyOptions" id="concurrency256" value="256" onChange={() => handleInputChange("concurrencyLevel", 256)} />
                                <label className="form-check-label" htmlFor="concurrency256">
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

                        <div className="card-header">4. Workload Option</div>

                        <div className="card-body">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="workloadOptions" id="workloadA" value="A" onChange={() => handleInputChange("workloadType", "A")} />
                                <label className="form-check-label" htmlFor="workloadA">
                                    Workload A
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="workloadOptions" id="workloadB" value="B" onChange={() => handleInputChange("workloadType", "B")} />
                                <label className="form-check-label" htmlFor="workloadB">
                                    Workload B
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="workloadOptions" id="workloadF" value="C" onChange={() => handleInputChange("workloadType", "F")} />
                                <label className="form-check-label" htmlFor="workloadF">
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
        </div>
    );
}

export default Questions;
