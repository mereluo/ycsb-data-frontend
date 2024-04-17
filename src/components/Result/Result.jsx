import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort, faSortUp, faSortDown } from "@fortawesome/free-solid-svg-icons";
import Table from "./Statistics/Table.jsx";
import Graph from "./Statistics/Graph.jsx";
import { useTable, useSortBy } from "react-table";
import { Button, Typography } from "@mui/joy";
import "./result.css";
import ServerPath from "../../context/ServerPath";

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
        try {
            const response = await fetch(`${ServerPath}/api/workload/delete/${deleteId}`, {
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
                    <Button size="sm" variant={`${showData[index] ? "soft" : "outlined"}`} onClick={() => toggleData(index)}>
                        {showData[index] ? "Hide" : "Show"}
                    </Button>
                ),
            },
            {
                Header: "Delete",
                accessor: (row, index) => (
                    <Button size="sm" variant="outlined" color="danger" onClick={() => handleDelete(index)}>
                        Delete
                    </Button>
                ),
            },
        ],
        [showData, workloads]
    );
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data: workloads }, useSortBy);

    return (
        <div>
            <div className="ml-4" style={{ maxHeight: "30vh", overflowY: "auto" }}>
                <table {...getTableProps()} className="table">
                    <thead className="sticky-header">
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
            <Button className="ml-4" variant="outlined" onClick={goBack}>
                Start Another Search
            </Button>
            <div className="d-flex flex-wrap mt-3" style={{ maxHeight: "60vh", overflowY: "auto" }}>
                {workloads.map(
                    (workload, index) =>
                        showData[index] && (
                            <div key={workload.id} className="col-6">
                                <div>
                                    <Typography level="title-md" variant="soft">
                                        Table for Index {index + 1}
                                    </Typography>
                                    <Table workload={workload} />
                                    <Graph workload={workload} />
                                </div>
                            </div>
                        )
                )}
            </div>
        </div>
    );
}

export default Result;
