import { useContext } from 'react';
import { TSTemplate, definedWorkloadType } from '../../models/Templates';
import WorkloadFactory from './Workload/WorkloadFactory';
import WorkloadCustomize from './Workload/WorkloadCustomize';
import { FieldContext } from '../../context/FieldContext';
import { Typography } from '@mui/joy';
import Papa from 'papaparse';

function WorkloadForm() {
  const { DBState, setDBState } = useContext(FieldContext);

  const handleDownload = () => {
    const createTemplate = (template, filename) => {
      const blob = new Blob([template], { type: 'text/csv' });

      // Create a URL for the Blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary anchor element to trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.download = filename + '.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    };
    createTemplate(TSTemplate, 'time-series');
  };
  const renderDataForm = () => {
    if (DBState.workloadType) {
      if (definedWorkloadType.includes(DBState.workloadType) && DBState.type) {
        return (
          <WorkloadFactory
            type={DBState.workloadType}
            test={DBState.type}
          />
        );
      } else {
        return <WorkloadCustomize type={DBState.workloadType} />;
      }
    }
  };
  const handleTimeSeriesUpload = (event) => {
    // Handle the uploaded file here
    const file = event.target.files[0];
    if (file) {
      Papa.parse(event.target.files[0], {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          const inputData = results.data;
          const resultObject = {};

          inputData.forEach((item) => {
            const { category, time, mean_latency } = item;
            if (!resultObject[category]) {
              resultObject[category] = {
                time: [],
                latency: [],
              };
            }
            resultObject[category].time.push(time);
            resultObject[category].latency.push(mean_latency);
          });
          const finalResult = {
            data: resultObject,
          };

          setDBState((prevState) => ({ ...prevState, ['timeSeries']: finalResult }));
        },
      });
    }
  };
  return (
    <div className='row'>
      <div className='card border-bottom-0 border-top-0 col-9 mr-3'>
        <Typography
          className='card-header'
          color='primary'
          level='title-md'
          variant='soft'
        >
          3. Workload Data
        </Typography>
        {renderDataForm()}
      </div>
      <div className='card border-bottom-0 border-top-0 col'>
        <Typography
          className='card-header'
          color='primary'
          level='title-md'
          variant='soft'
        >
          4. Upload Time Series CSV
        </Typography>
        <div className='mt-4'>
          <p>Download CSV Template</p>
          <button
            className='btn btn-outline-info p-3'
            onClick={handleDownload}
          >
            Download Template
          </button>
        </div>
        <div className='custom-file mt-5'>
          <input
            type='file'
            className='custom-file-input'
            id='csvFile'
            accept='.csv'
            onChange={handleTimeSeriesUpload}
          />
          <label
            className='custom-file-label'
            htmlFor='csvFile'
          >
            Choose file
          </label>
        </div>
      </div>
    </div>
  );
}

export default WorkloadForm;
