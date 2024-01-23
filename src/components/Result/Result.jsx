import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./result.css";
import { Chart as ChartJS, LineElement, PointElement, Filler, LinearScale } from "chart.js";
import { Scatter } from "react-chartjs-2";
ChartJS.register(LineElement, PointElement, Filler, LinearScale);

function Result() {
    const location = useLocation();
    const navigateTo = useNavigate();
    const workload = location.state.workload;
    console.log(workload);
    const database = workload.testConfig.dbConfig.databaseOption.database;
    const timeSeries = workload.timeSeries.data;
    console.log(timeSeries);

    const goBack = () => {
        navigateTo("/start");
    };

    const downloadCSV = () => {
        // Create a CSV string with headers
        let csvContent = "category,time,mean_latency\n";

        // Iterate over entries in the data object
        Object.keys(timeSeries).forEach((entryKey) => {
            const entry = timeSeries[entryKey];

            // Iterate over latency and time arrays
            entry.latency.forEach((latency, index) => {
                const time = entry.time[index];

                // Append a new line with category, time, and mean_latency values
                csvContent += `${entryKey},${time},${latency}\n`;
            });
        });

        // Create a Blob containing the CSV content
        const blob = new Blob([csvContent], { type: "text/csv" });

        // Create a link element and trigger a download
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "timeSeries.csv";
        link.click();
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
        tooltips: {
            mode: "index",
            intersect: false,
        },
        hover: {
            mode: "nearest",
            intersect: true,
        },
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
                },
                beginAtZero: true,
            },
            y: {
                title: {
                    display: true,
                    text: "Mean performance time (milliseconds)",
                },
                beginAtZero: true,
            },
        },
        elements: {
            line: {
                tension: 0.4,
            },
        },
    };

    function getRandomColor() {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    const datasets = Object.keys(timeSeries).map((entryKey) => {
        const entry = timeSeries[entryKey];
        const label = `Mean ${entryKey.toUpperCase()} Latency`;
        const transformedData = entry.time.map((value, index) => ({
            x: value,
            y: entry.latency[index],
        }));
        return {
            label,
            data: transformedData,
            showLine: true,
            fill: false,
            borderColor: getRandomColor(),
        };
    });
    console.log(datasets);

    const data = {
        datasets: datasets,
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
                    <Scatter options={options} data={data} />
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
