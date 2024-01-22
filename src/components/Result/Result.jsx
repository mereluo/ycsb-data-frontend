import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./result.css";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Result() {
    const location = useLocation();
    const navigateTo = useNavigate();
    const workload = location.state.workload;
    console.log(workload);
    const database = workload.testConfig.dbConfig.databaseOption.database;

    const goBack = () => {
        navigateTo("/start");
    };

    const downloadCSV = () => {
        // Add logic to download data as CSV
    };

    const renderRows = () => {
        const keysToExclude = ["testConfig", "timeSeries", "id"];
        const keys = Object.keys(workload).filter((key) => !keysToExclude.includes(key));

        return keys.map((key) => (
            <tr key={key}>
                <td className="p-3 ">{key}</td>
                <td className="p-3">{workload[key]}</td>
            </tr>
        ));
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: "Time Series Line Chart",
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Time elapsed (milliseconds)",
                    offset: true,
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Mean performance time (milliseconds)",
                    offset: true,
                },
            },
        },
    };

    const data = {
        labels: [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000],
        datasets: [
            {
                label: "Mean READ Latency",
                data: [32612, 27861, 28008, 27136, 27137, 27138, 27169, 26761, 26313, 25315],
                borderColor: "rgba(75,192,192,1)",
            },
            {
                label: "Mean Update Latency",
                data: [66708, 55467, 51148, 49795, 50543, 49862, 49439, 49592, 48217, 48885],
                borderColor: "#742774",
            },
        ],
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4">
                Workload {workload.workloadType} Data for {database}
            </h1>
            <div className="statistics">
                <table className="table table-striped text-center w-auto mr-4">
                    <thead>
                        <tr>
                            <th>Metric</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>{renderRows()}</tbody>
                </table>
                <div className="graph-box">
                    <Line options={options} data={data} />
                </div>
            </div>
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
