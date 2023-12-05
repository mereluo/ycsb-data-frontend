import { useState } from "react";
import "./questions.css";
import axios from "axios";

function Questions() {
    const DBOption = [
        { id: 1, label: "Google Spanner" },
        { id: 2, label: "CockroachDB" },
        { id: 3, label: "MongoDB" },
    ];

    const MyForm = () => {
        const [formData, setFormData] = useState({
            database: "",
            isTransactional: false,
            numOfNodes: 0,
            isMultiRegion: false,
            concurrencyLevel: 64,
            recordCounts: 0,
            workloadOption: A,
        });
    };
    const [question1Response, setQuestion1Response] = useState(null);

    const handleSubmit = () => {
        console.log("Submit");
    };

    const handleChange = () => {};

    return (
        <div>
            <form onSubmit={handleSubmit} className="card">
                <div className="mb-3">
                    <label htmlFor="database" className="form-label">
                        Database Option
                    </label>
                    <select className="form-select" id="database" name="database" onChange={handleChange} required>
                        <option value="">Select Database</option>
                        <option value="Google Spanner">Google Spanner</option>
                        <option value="CockroachDB">CockroachDB</option>
                        <option value="MongoDB">MongoDB</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">
                    Submit
                </button>
            </form>
        </div>
    );
}

export default Questions;
