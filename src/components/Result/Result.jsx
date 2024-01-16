import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./result.css";

function Result() {
    const location = useLocation();
    const navigateTo = useNavigate();
    const workload = location.state.workload;
    const database = workload.testConfigA.dbConfig.databaseOption.database;
    console.log(workload);
    const goBack = () => {
        navigateTo("/start");
    };
    const downloadCSV = () => {
        // Add logic to download data as CSV
    };
    const renderRows = () => {
        const keysToExclude = ["testConfigA", "timeSeries", "id"];
        const keys = Object.keys(workload).filter((key) => !keysToExclude.includes(key));

        return keys.map((key) => (
            <tr key={key}>
                <td className="p-3 ">{key}</td>
                <td className="p-3">{workload[key]}</td>
            </tr>
        ));
    };
    return (
        <div className="container mt-5">
            <h1 className="mb-4">Workload A Data for {database}</h1>
            <table className="table table-striped table-hover text-center w-auto ">
                <thead>
                    <tr>
                        <th>Metric</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>{renderRows()}</tbody>
            </table>
            <div className="button-box">
                <button className="btn btn-primary mt-3" onClick={downloadCSV}>
                    Download CSV
                </button>
                <button className="btn btn-secondary ml-2 mt-3" onClick={goBack}>
                    Go Back
                </button>
            </div>
        </div>
    );
}

export default Result;
