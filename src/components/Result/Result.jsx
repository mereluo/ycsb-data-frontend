import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort, faSortUp, faSortDown } from "@fortawesome/free-solid-svg-icons";
import Table from "./Statistics/Table.jsx";
import Graph from "./Statistics/Graph.jsx";
import { useTable, useSortBy } from "react-table";
import "./result.css";

function Result() {
    const location = useLocation();
    const workloads = location.state.workload;
    const navigateTo = useNavigate();
    const [showData, setShowData] = useState(Array(workloads.length).fill(false));

    useEffect(() => {
        // Your logic here (if needed) when showData changes
        // This will run after each render when showData changes
    }, [showData]);

    // console.log(location.state.workload);
    const goBack = () => {
        navigateTo("/search");
    };

    const toggleData = (index) => {
        setShowData((prevShowData) => {
            const updateShowData = [...prevShowData];
            updateShowData[index] = !updateShowData[index];
            return updateShowData;
        });
    };

    const columns = React.useMemo(
        () => [
            { Header: "Index", accessor: (row, index) => index + 1 },
            { Header: "Test Type", accessor: "type" },
            { Header: "Database", accessor: "database" },
            { Header: "Workload Type", accessor: "workloadType" },
            { Header: "Update By", accessor: "updateType" },
            { Header: "Concurrency Level", accessor: "concurrencyLevel" },
            { Header: "Record Counts", accessor: "recordCounts" },
            { Header: "Number of Nodes", accessor: "numOfNodes" },
            { Header: "Multi-regional", accessor: "isMultiRegional" },
            {
                Header: "Details",
                accessor: (row, index) => (
                    <button className="btn btn-outline-info btn-sm" onClick={() => toggleData(index)}>
                        {showData[index] ? "Hide Data" : "Show Data"}
                    </button>
                ),
            },
        ],
        [showData]
    );
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data: workloads }, useSortBy);

    return (
        <div>
            <div className="mt-4 ml-4">
                <table {...getTableProps()} className="table">
                    <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                        {column.render("Header")}
                                        <span>{column.isSorted ? column.isSortedDesc ? <FontAwesomeIcon icon={faSortDown} /> : <FontAwesomeIcon icon={faSortUp} /> : <FontAwesomeIcon icon={faSort} />}</span>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {rows.map((row) => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map((cell) => (
                                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <button className="btn btn-outline-primary" onClick={goBack}>
                Start Another Search
            </button>
            <div className="d-flex flex-wrap mt-3">
                {workloads.map((workload, index) => (
                    <div key={index} className="ml-3 mb-3">
                        {showData[index] && <h5>Table for {index + 1}</h5>}
                        {showData[index] && <Table workload={workload} />}
                        {showData[index] && <Graph workload={workload} />}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Result;
