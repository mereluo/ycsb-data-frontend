import { useState, useEffect } from "react";
import Papa from "papaparse";
import { ATemplate } from "../../models/Workload";

function Upload() {
    const [workload, setWorkload] = useState(null);

    // Download workloadA template
    const handleDownload = () => {
        const createTemplate = (template, filename) => {
            const blob = new Blob([template], { type: "text/csv" });

            // Create a URL for the Blob
            const url = window.URL.createObjectURL(blob);

            // Create a temporary anchor element to trigger the download
            const a = document.createElement("a");
            a.href = url;
            a.download = filename + ".csv";
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        };
        createTemplate(ATemplate, "workloadA");
    };

    // Create workloadA instance
    const handleUpload = (event) => {
        // Handle the uploaded file here
        const file = event.target.files[0];
        if (file) {
            Papa.parse(event.target.files[0], {
                header: true,
                skipEmptyLines: true,
                complete: function (results) {
                    setWorkload(results.data[0]);
                },
            });
        }
    };

    useEffect(() => {
        if (workload !== null) {
            createWorkloadA();
        }
    }, [workload]);

    const createWorkloadA = async () => {
        const type = workload.workloadType;
        const fetchPath = type.toUpperCase();
        try {
            const entity = await fetch(`http://localhost:8080/api/workload${fetchPath}/save`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(workload),
            });
            const workloadA = await entity.json();
            console.log("WorloadA created: ", workloadA);
        } catch (error) {
            console.error("Error creating workloadA: ", error);
        }
    };

    return (
        <div className="container">
            <h2 className="mt-4">Upload Your Data</h2>

            <div className="mt-4">
                <h4>Download CSV Template</h4>
                <button className="btn btn-outline-info p-3" onClick={handleDownload}>
                    Download Template
                </button>
            </div>
            <div className="mt-4">
                <h4>Upload CSV File</h4>
                <div className="custom-file">
                    <input type="file" className="custom-file-input" id="csvFile" accept=".csv" onChange={handleUpload} />
                    <label className="custom-file-label col-5" htmlFor="csvFile">
                        Choose local file
                    </label>
                </div>
            </div>
            <br />
            <table className="table">
                <thead>
                    <tr>
                        <th>Field</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    {workload === null ? (
                        <tr>
                            <td>No data uploaded</td>
                        </tr>
                    ) : (
                        Object.entries(workload).map(([key, value]) => (
                            <tr key={key}>
                                <th>{key}</th>
                                <td>{value}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default Upload;
