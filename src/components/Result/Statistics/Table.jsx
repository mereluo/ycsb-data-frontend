import React from "react";
import "./Table.css";

function Table({ workload }) {
    const renderRows = () => {
        const keys = Object.keys(workload.userDefinedFields);

        return keys.map((key) => (
            <tr className="table-content" key={key}>
                <td className="pt-2 pb-2 td-key">{key}</td>
                <td className="pt-2 pb-2">{workload.userDefinedFields[key]}</td>
            </tr>
        ));
    };
    return (
        <div className="table-container">
            <table className="table table-hover table-sm text-center">
                <thead className="thead-light">
                    <tr>
                        <th>Metric</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>{renderRows()}</tbody>
            </table>
        </div>
    );
}

export default Table;