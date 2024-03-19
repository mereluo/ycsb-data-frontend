import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import "./table.css";

function CustomTable({ workload }) {
    const renderRows = () => {
        const keys = Object.keys(workload.userDefinedFields);

        return keys.map((key) => (
            <TableRow key={key} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell component="th" scope="row" align="center">
                    {key}
                </TableCell>
                <TableCell align="center">{workload.userDefinedFields[key]}</TableCell>
            </TableRow>
        ));
    };

    return (
        <div className="table-container">
            <TableContainer component={Paper}>
                <Table className="table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">
                                <strong>Metric</strong>
                            </TableCell>
                            <TableCell align="center">
                                <strong>Value</strong>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>{renderRows()}</TableBody>
                </Table>
            </TableContainer>
            <div className="mb-4 mt-2">
                {workload.description && <div> Description:{workload.description}</div>}
                {workload.locationDetails && <div>Location Details: {workload.locationDetails}</div>}
                {workload.commandLine && <div>Command Line: {workload.commandLine}</div>}
            </div>
        </div>
    );
}

export default CustomTable;
