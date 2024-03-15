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
    let initialWorkloads = location.state.workload || [];
    const navigateTo = useNavigate();
    const [workloads, setWorkloads] = useState(initialWorkloads);
    const [showData, setShowData] = useState(Array(initialWorkloads.length).fill(false));

    useEffect(() => {
        // Update workloads when the location state changes
        setShowData(Array(workloads).fill(false));
    }, [workloads]);

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

    const handleDelete = async (index) => {
        const deleteId = workloads[index].id;
        console.log(deleteId);
        try {
            const response = await fetch(`http://localhost:8080/api/workload/delete/${deleteId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                console.log("Delete Success");
                setWorkloads((prevWorkloads) => prevWorkloads.filter((_, i) => i !== index));
            } else {
                const data = await response.json();
                console.log(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error("Error deleting workload:", error);
        }
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
            { Header: "Co-located", accessor: "isCoLocated" },
            {
                Header: "Details",
                accessor: (row, index) => (
                    <button className="btn btn-outline-info btn-sm" onClick={() => toggleData(index)}>
                        {showData[index] ? "Hide" : "Show"}
                    </button>
                ),
            },
            {
                Header: "Delete",
                accessor: (row, index) => (
                    <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(index)}>
                        Delete
                    </button>
                ),
            },
        ],
        [showData, workloads]
    );
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data: workloads }, useSortBy);

    return (
        <div>
            <div className="mt-4 ml-4" style={{ maxHeight: "50vh", overflowY: "auto" }}>
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
            <div className="d-flex flex-wrap mt-3" style={{ maxHeight: "50vh", overflowY: "auto" }}>
                {workloads.map((workload, index) => (
                    <div key={index} className="">
                        {showData[index] && (
                            <div>
                                <h5>Table for {index + 1}</h5>
                                <Table workload={workload} />
                                <Graph workload={workload} />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Result;
