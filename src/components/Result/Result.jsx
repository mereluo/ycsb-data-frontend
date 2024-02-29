import React from "react";
import "./result.css";
import { Chart as ChartJS, LineElement, PointElement, Filler, LinearScale, Tooltip, Legend, Title } from "chart.js";
import { Scatter } from "react-chartjs-2";
ChartJS.register(LineElement, PointElement, Filler, LinearScale, Tooltip, Legend, Title);

function Result({ workload }) {
    console.log(workload);
    const timeSeries = workload.timeSeries;
    console.log(timeSeries);

    const downloadCSV = () => {
        let csvContent = "category,time,mean_latency\n";

        Object.keys(timeSeries).forEach((entryKey) => {
            const entry = timeSeries[entryKey];

            entry.latency.forEach((latency, index) => {
                const time = entry.time[index];

                csvContent += `${entryKey},${time},${latency}\n`;
            });
        });

        const blob = new Blob([csvContent], { type: "text/csv" });

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "timeSeries.csv";
        link.click();
    };

    const renderRows = () => {
        const keys = Object.keys(workload.userDefinedFields);

        return keys.map((key) => (
            <tr key={key}>
                <td className="pt-2 pb-2">{key}</td>
                <td className="pt-2 pb-2">{workload.userDefinedFields[key]}</td>
            </tr>
        ));
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: "top",
            },
            title: {
                display: true,
                text: "Time Series",
            },
            tooltips: {
                mode: "index",
                intersect: false,
            },
        },
        hover: {
            mode: "nearest",
            intersect: false,
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

    const buildData = () => {
        if (timeSeries !== null) {
            return Object.keys(timeSeries).map((entryKey) => {
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
        }
        return null;
    };

    const data = {
        datasets: buildData(),
    };

    return (
        <div className="result-container">
            <div className="statistics">
                <table className="table table-hover table-sm mr-4 text-center">
                    <thead className="thead-light">
                        <tr>
                            <th>Metric</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>{renderRows()}</tbody>
                </table>
                {(timeSeries && (
                    <div className="graph-box">
                        <Scatter options={options} data={data} />
                    </div>
                )) || <div>No Time Series Data Available</div>}
            </div>
            <div className="button-box">
                <button className="btn btn-primary btn-sm mt-3 mb-3" onClick={downloadCSV} disabled={timeSeries === null}>
                    Download Time Series CSV
                </button>
            </div>
        </div>
    );
}

export default Result;
