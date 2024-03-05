import React from "react";

function UploadResult({ formState, submissionResult }) {
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
    const handleRetract = () => {};
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
                            <strong>Workload created successfully!</strong>{" "}
                            <button className="btn btn-outline-danger p-2 m-2" onClick={handleRetract}>
                                Retract Upload
                            </button>
                            {submissionResult && Object.keys(submissionResult).length > 0 ? (
                                <div>
                                    <div className="row">
                                        <table className="table col">
                                            <thead>
                                                <tr>
                                                    <th>Configurations</th>
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
