import React from "react";
import { Table, Typography } from "@mui/joy";

import "./table.css";

function CustomTable({ workload }) {
    const renderRows = () => {
        const keys = Object.keys(workload.userDefinedFields);

        return keys.map((key) => (
            <tr className="table-content" key={key}>
                <td className="pt-2 pb-2" style={{ textAlign: "center" }}>
                    {key}
                </td>
                <td className="pt-2 pb-2">{workload.userDefinedFields[key]}</td>
            </tr>
        ));
    };

    return (
        <div className="table-container">
            <Table hoverRow color="neutral" size="sm" variant="plain" borderAxis="x">
                <thead>
                    <tr>
                        <th style={{ textAlign: "center" }}>Metric</th>
                        <th style={{ width: "40%" }}>Value</th>
                    </tr>
                </thead>
                <tbody>{renderRows()}</tbody>
            </Table>
            <div className="mb-4 mt-2">
                {workload.description && <Typography level="body-sm">Database Description:{workload.description}</Typography>}
                {workload.locationDetails && <div>Location Details: {workload.locationDetails}</div>}
                {workload.workloadDescription && <div>Workload Description: {workload.workloadDescription}</div>}
                {workload.commandLine && <div>Command Line: {workload.commandLine}</div>}
            </div>
        </div>
    );
}

export default CustomTable;
