import { useContext, useState, useEffect } from 'react';
import { FieldContext } from '../../context/FieldContext';
import DBForm from '../Form/DBForm';
import TestForm from '../Form/TestForm';
import WorkloadForm from '../Form/WorkloadForm';
import SingleResult from './SingleResult';
import { Typography, Button, CircularProgress } from '@mui/joy';
import ServerPath from '../../context/ServerPath';

function SingleUpload() {
  const { DBState, setDBState } = useContext(FieldContext);
  const [workloadId, SetWorkloadID] = useState(null);
  const [tablesHidden, setTablesHidden] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setDBState({});
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    console.log(DBState);
    try {
      const entity = await fetch(`${ServerPath}/api/workload/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(DBState),
      });
      const result = await entity.json();
      console.log('result for item: ', result);
      SetWorkloadID(result.id);
      setTablesHidden(false);
      setLoading(false);
    } catch (error) {
      console.error('Error creating workload: ', error);
      SetWorkloadID({
        error: 'Failed to create workload. Please try again.',
        details: error,
      });
    }
  };

  return (
    <div className="container">
      <div className="mt-3">
        <Typography color="neutral" level="h3" variant="plain" className="mb-2">
          Upload Data
        </Typography>
        <Typography color="neutral" level="body-md" variant="soft">
          Fill in the required fields and upload the time series data as CSV (Optional).
        </Typography>
      </div>
      <form onSubmit={(event) => handleSubmit(event)}>
        <div className="question-container mt-2">
          <DBForm isUpload={true} />
          <TestForm key={0} id={0} isUpload={true} isBatch={false} />
          <WorkloadForm />
        </div>

        <div className="mt-3 text-center">
          {loading ? (
            <Button className="col-md-5" variant="outlined" startDecorator={<CircularProgress variant="solid" />}>
              Loading…
            </Button>
          ) : (
            <Button className="col-md-5" variant="outlined" type="submit">
              Submit
            </Button>
          )}
        </div>
      </form>
      <div className="mt-3 text-center">
        <SingleResult formState={DBState} workloadId={workloadId} setTablesHidden={setTablesHidden} tablesHidden={tablesHidden} />
      </div>
    </div>
  );
}

export default SingleUpload;
