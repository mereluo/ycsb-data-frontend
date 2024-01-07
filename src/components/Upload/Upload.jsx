import { useState, useEffect } from "react";
import Papa from "papaparse";
import { ATemplate } from "../../models/WorkloadA";

function Upload() {
    const [workload, setWorkload] = useState(null);

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
        try {
            // Create DatabaseOption
            const databaseOptionResponse = await fetch("http://localhost:8080/api/dbOption", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ database: workload.database }),
            });
            const databaseOption = await databaseOptionResponse.json();

            // Create DBconfig
            const dbConfigResponse = await fetch("http://localhost:8080/api/dbConfig", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    databaseOption: { id: databaseOption.id },
                    description: workload.description,
                    isTransactional: workload.isTransactional,
                    platform: workload.platform,
                    numOfNodes: workload.numOfNodes,
                    numOfRegions: workload.numOfRegions,
                    isMultiRegion: workload.isMultiRegion,
                }),
            });
            const dbConfig = await dbConfigResponse.json();

            // Create TestConfig
            const testConfigResponse = await fetch("http://localhost:8080/api/testConfig", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    concurrencyLevel: workload.concurrencyLevel,
                    recordCounts: workload.recordCounts,
                    commandLine: workload.commandLine,
                    dbConfig: { id: dbConfig.id },
                }),
            });
            const testConfig = await testConfigResponse.json();

            // Create WorkloadA
            const workloadAResponse = await fetch("http://localhost:8080/api/workloadA", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    opsPerSec: workload.opsPerSec,
                    readMeanLatency: workload.readMeanLatency,
                    readMaxLatency: workload.readMaxLatency,
                    readP95: workload.readP95,
                    readP99: workload.readP99,
                    updateMeanLatency: workload.updateMeanLatency,
                    updateMaxLatency: workload.updateMaxLatency,
                    updateP95: workload.updateP95,
                    updateP99: workload.updateP99,
                    timeSeries: { key: "testkey", value: "testlatency" },
                    testConfigA: { id: testConfig.id },
                }),
            });
            const workloadA = await workloadAResponse.json();
            console.log("WorloadA created: ", workloadA);
        } catch (error) {
            console.error("Error creating workloadA: ", error);
        }
    };

    return (
        <div className="container">
            <h1 className="mt-5">Upload Your Data</h1>

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
