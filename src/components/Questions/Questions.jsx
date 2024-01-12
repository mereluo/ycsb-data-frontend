import { useState } from "react";
import "./questions.css";
function Questions() {
    const DBOption = [
        { id: 1, label: "Spanner" },
        { id: 2, label: "CockroachDB" },
        { id: 3, label: "MongoDB" },
    ];

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
    });

    const handleInputChange = (fieldName, value) => {
        setFormState((prevState) => ({ ...prevState, [fieldName]: value }));
    };

    const handleSubmit = async () => {
        console.log(formState);
        try {
            const entity = await fetch("http://localhost:8080/api/workloadA/retrieveA", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formState),
            });
            const workloadA = await entity.json();
            console.log("WorkloadA requested: ", workloadA);
        } catch (error) {
            console.error("Error finding workloadA: ", error);
        }
    };

    return (
        <div>
            <div className="card text-center">
                <div className="card-header">Database Options</div>

                <div className="card-body">
                    <h5 className="card-title">Please select the database that you want to do the comparison</h5>

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
            </div>

            <div className="card text-center">
                <div className="card-header">Database Configuration</div>

                <div className="card-body">
                    <h5 className="card-title">Please indicate the database configuration in the following field</h5>

                    <p className="card-text">Description</p>
                    <input type="text" id="description-input" className="form-control col-3" onChange={(e) => handleInputChange("description", e.target.value)} />

                    <p className="card-text mt-2">Platform</p>
                    <input type="text" id="platform-input" className="form-control col-3" onChange={(e) => handleInputChange("platform", e.target.value)} />

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

                    <p className="card-text">Number of Nodes</p>
                    <input type="number" id="number-input" className="form-control " onChange={(e) => handleInputChange("numOfNodes", e.target.value)} />

                    <p className="card-text">Is MultiRegion</p>

                    <button className="btn btn-primary" onClick={() => handleInputChange("isMultiRegion", true)}>
                        Yes
                    </button>
                    <button className="btn btn-primary" style={{ marginLeft: "5px" }} onClick={() => handleInputChange("isMultiRegion", false)}>
                        No
                    </button>

                    {formState.isMultiRegion && (
                        <div>
                            <p className="card-text">Number of regions</p>
                            <input type="number" id="number-input" className="form-control " onChange={(e) => handleInputChange("numOfRegions", e.target.value)} />
                        </div>
                    )}
                </div>
            </div>

            <div className="card text-center">
                <div className="card-header">Test Configuration</div>

                <div className="card-body">
                    <h5 className="card-title">Please indicate the database configuration in the following field</h5>
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

                    <p className="card-text">Record Counts</p>
                    <input type="number" id="number-input" className="form-control " onChange={(e) => handleInputChange("recordCounts", e.target.value)} />

                    <p className="card-text">Command Line</p>
                    <input type="text" id="command-line-input" className="form-control col-3" onChange={(e) => handleInputChange("commandLine", e.target.value)} />
                </div>
            </div>

            <div className="card text-center">
                <div className="card-header">Workload Option</div>

                <div className="card-body">
                    <h5 className="card-title">Please indicate the workload you want to test</h5>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="workloadOptions" id="inlineRadio1" value="option1" />
                        <label className="form-check-label" htmlFor="inlineRadio1">
                            Workload A
                        </label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="workloadOptions" id="inlineRadio2" value="option2" />
                        <label className="form-check-label" htmlFor="inlineRadio2">
                            Workload B
                        </label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="workloadOptions" id="inlineRadio3" value="option3" />
                        <label className="form-check-label" htmlFor="inlineRadio2">
                            Workload F
                        </label>
                    </div>
                </div>
            </div>
            <div className="mt-2 text-center">
                <button className="btn btn-primary" onClick={handleSubmit}>
                    Submit
                </button>
            </div>
        </div>
    );
}

export default Questions;
