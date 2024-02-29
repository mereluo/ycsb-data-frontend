import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Table from "./Statistics/Table.jsx";
import Graph from "./Statistics/Graph.jsx";

function ResultMain() {
    const location = useLocation();
    const workloads = location.state.workload;
    const navigateTo = useNavigate();
    const [showData, setShowData] = useState(Array(workloads.length).fill(false));

    const goBack = () => {
        navigateTo("/search");
    };

    const toggleData = (index) => {
        const updateShowData = [...showData];
        updateShowData[index] = !updateShowData[index];
        setShowData(updateShowData);
    };

    console.log(location.state.workload);
    return (
        <div>
            <div className="mt-4 ml-4">
                {workloads.map((workload, index) => (
                    <div key={index} className="workload-container d-flex flex-lg-row ">
                        <div className="configuration mr-4">
                            <h4>
                                {index + 1}. Workload {workload.workloadType} for {workload.database}
                            </h4>
                            <p>
                                <div className="card" style={{ width: "25rem" }}>
                                    <div className="card-body">
                                        <h5 className="card-title">Configurations:</h5>
                                        <p className="card-text">
                                            <strong>Database:</strong> {workload.database}&nbsp;&nbsp;
                                            <strong>Type:</strong> {workload.type} <br />
                                            <strong>Workload Type:</strong> {workload.workloadType} &nbsp;&nbsp;
                                            <strong>Update By:</strong> {workload.updateType} <br />
                                            <strong>Concurrency Level:</strong> {workload.concurrencyLevel} <br />
                                            <strong>Record Counts:</strong> {workload.recordCounts} million
                                            <br />
                                            <strong>Number of Nodes:</strong> {workload.numOfNodes} <br />
                                            <strong>Multi-Regional:</strong> {workload.isMultiRegional} <br />
                                        </p>
                                    </div>
                                    <button className="btn btn-outline-info btn-sm" onClick={() => toggleData(index)}>
                                        {showData[index] ? "Hide Data" : "Show Data"}
                                    </button>
                                </div>
                            </p>
                        </div>
                        <div className="d-flex flex-column">
                            <div className="ml-3">{showData[index] && <Table workload={workload} />}</div>
                            <div className="ml-3">{showData[index] && <Graph workload={workload} />}</div>
                        </div>
                    </div>
                ))}
                <button className="btn btn-outline-primary mt-3" onClick={goBack}>
                    Start Another Search
                </button>
            </div>
        </div>
    );
}

export default ResultMain;
