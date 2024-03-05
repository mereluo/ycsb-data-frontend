import { useState } from "react";

function UploadResult({ formState, submissionResult }) {
    const [deleteResult, setDeleteResult] = useState(null);
    const [tablesHidden, setTablesHidden] = useState(false);

    const generateTable = () => {
        const excludedKeys = ["timeSeries", "userDefinedFields"];

        return Object.entries(formState)
            .filter(([key, value]) => !excludedKeys.includes(key))
            .map(([key, value]) => (
                <tr className="table-content" key={key}>
                    <td className="pt-2 pb-2">
                        <strong>{key}</strong>
                    </td>
                    <td className="pt-2 pb-2">{value}</td>
                </tr>
            ));
    };

    const generateMetric = () => {
        const userDefined = Object.keys(formState.userDefinedFields);
        return userDefined.map((key) => (
            <tr className="table-content" key={key}>
                <td className="pt-2 pb-2">
                    <strong>{key}</strong>
                </td>
                <td className="pt-2 pb-2">{formState.userDefinedFields[key]}</td>
            </tr>
        ));
    };

    const handleRetract = async () => {
        try {
            const response = await fetch(`/api/workloads/${submissionResult.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            setTablesHidden(true);
            if (response.ok) {
                setDeleteResult(`Workload with ID ${submissionResult.id} deleted successfully`);
            } else {
                const data = await response.json();
                setDeleteResult(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error("Error deleting workload:", error);
            setDeleteResult("Error deleting workload. Please try again.");
        }
    };

    return (
        <div>
            {submissionResult && (
                <div className={`mt-3 alert ${submissionResult.error ? "alert-danger" : "alert-success"}`} role="alert">
                    {submissionResult.error ? (
                        <div>
                            <strong>{submissionResult.error}</strong>
                            <br />
                            <strong>Error Details:</strong> {submissionResult.details}
                        </div>
                    ) : (
                        <div>
                            {Object.keys(submissionResult).length > 0 ? (
                                <div>
                                    {tablesHidden ? (
                                        <p>{deleteResult}</p>
                                    ) : (
                                        <div>
                                            <strong>Workload created successfully!</strong>
                                            <button className="btn btn-outline-danger p-2 m-2" onClick={handleRetract}>
                                                Retract Upload
                                            </button>
                                            <div className="row">
                                                <table className="table col">
                                                    <thead>
                                                        <tr>
                                                            <th>Configuration</th>
                                                            <th>Value</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>{generateTable()}</tbody>
                                                </table>
                                                <table className="table col ml-3">
                                                    <thead>
                                                        <tr>
                                                            <th>Metric</th>
                                                            <th>Value</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>{generateMetric()}</tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p>Loading...</p>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default UploadResult;
