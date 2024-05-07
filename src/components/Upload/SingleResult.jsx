import { useState } from 'react';
import ServerPath from '../../context/ServerPath';

function SingleResult({ formState, workloadId, tablesHidden, setTablesHidden, index }) {
  const [deleteResult, setDeleteResult] = useState(null);

  const updateHiddenState = () => {
    if (index >= 0) {
      setTablesHidden((prevState) => {
        return prevState.map((hidden, i) => (i === index ? true : hidden));
      });
    } else {
      setTablesHidden(true);
    }
  };

  // If there are multiple tables
  const generateTable = () => {
    const excludedKeys = ['timeSeries', 'userDefinedFields'];

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
      const response = await fetch(`${ServerPath}/api/workload/delete/${workloadId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        setDeleteResult(`Workload retracted successfully`);
        updateHiddenState();
      } else {
        const data = await response.json();
        setDeleteResult(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error deleting workload:', error);
      setDeleteResult('Error deleting workload. Please try again.');
    }
  };

  return (
    <div>
      {workloadId && (
        <div className="mt-3">
          {workloadId.error ? (
            <div className="alert alert-danger" role="alert">
              <strong>{workloadId.error}</strong>
              <br />
              <strong>Error Details:</strong> {workloadId.details}
            </div>
          ) : (
            <div>
              {(index && tablesHidden[index]) || tablesHidden ? (
                <strong>{deleteResult}</strong>
              ) : (
                <div>
                  {Object.keys(workloadId).length > 0 && (
                    <div>
                      <div className="alert alert-success" role="alert">
                        <strong>Workload created successfully!</strong>
                        <button className="btn btn-outline-danger ml-3 p-2 " onClick={handleRetract}>
                          Retract Upload
                        </button>
                      </div>

                      <div className="row mt-3">
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
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SingleResult;
