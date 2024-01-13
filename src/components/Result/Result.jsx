import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Result() {
    const location = useLocation();
    const navigateTo = useNavigate();
    const workload = location.state.workload;

    const goBack = () => {
        navigateTo("/start");
    };
    return (
        <div className="container mt-5">
            <h1 className="mb-4">Workload A Data</h1>
            <div className="card-body">
                <p className="card-text">
                    <strong className="card-title">Ops Per Sec: </strong>
                    {workload.opsPerSec}
                    <br />
                    <strong>Read Mean Latency:</strong> {workload.readMeanLatency}
                    <br />
                    <strong>Read Max Latency:</strong> {workload.readMaxLatency}
                    <br />
                    <strong>Read P95:</strong> {workload.readP95}
                    <br />
                    <strong>Read P99:</strong> {workload.readP99}
                    <br />
                    <strong>Update Mean Latency:</strong> {workload.updateMeanLatency}
                    <br />
                    <strong>Update Max Latency:</strong> {workload.updateMaxLatency}
                    <br />
                    <strong>Update P95:</strong> {workload.updateP95}
                    <br />
                    <strong>Update P99:</strong> {workload.updateP99}
                </p>
                <p className="card-text">
                    <strong>Database Option:</strong> {workload.testConfigA.dbConfig.databaseOption.database}
                    <br />
                    <strong>Platform:</strong> {workload.testConfigA.dbConfig.platform}
                    <br />
                    <strong>Number of Nodes:</strong> {workload.testConfigA.dbConfig.numOfNodes}
                    <br />
                    <strong>Number of Regions:</strong> {workload.testConfigA.dbConfig.numOfRegions}
                    <br />
                    <strong>Transactional:</strong> {workload.testConfigA.dbConfig.transactional ? "Yes" : "No"}
                    <br />
                    <strong>Multi-Region:</strong> {workload.testConfigA.dbConfig.multiRegion ? "Yes" : "No"}
                </p>
                <button className="btn btn-primary" onClick={goBack}>
                    Go Back
                </button>
            </div>
        </div>
    );
}

export default Result;
