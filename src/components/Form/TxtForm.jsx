import { useState, useContext, useEffect } from 'react';
import { FieldContext } from '../../context/FieldContext';

function TxtForm({ id, testState, setTestState }) {
  const { workloadList, setWorkloadList } = useContext(FieldContext);
  const [userDefinedFields, setUserDefinedFields] = useState(null);

  useEffect(() => {
    if (workloadList.length <= id) {
      setWorkloadList([...workloadList, testState]);
    } else {
      // If the array has enough elements, update the formState at the specified index
      setWorkloadList(workloadList.map((item, index) => (index === id ? testState : item)));
    }
    console.log(testState, id);
  }, [userDefinedFields, testState]);

  const handleFileUpload = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    const reader = new FileReader();

    const chunkSize = 30 * 1024; // 10KB
    let fileContent = '';

    reader.onload = async (event) => {
      const content = event.target.result;
      fileContent += content;

      // Continue reading next chunk
      if (file.size > reader.offset) {
        const blob = file.slice(reader.offset, reader.offset + chunkSize);
        reader.readAsText(blob);
      } else {
        // Extract user-defined fields
        const extractedData = extractUserDefinedFields(fileContent);
        console.log('extractedData', extractedData);
        const data = extractedData.data;
        if (Object.keys(data).length > 0) {
          setTestState((prevState) => ({ ...prevState, timeSeries: { data: data } }));
        } else {
          if (testState.hasOwnProperty('data')) {
            setTestState((prevState) => {
              const updatedState = { ...prevState };
              delete updatedState.data;
              return updatedState;
            });
          }
        }
        const userDefinedFields = reformatUserDefinedFields(extractedData.userDefinedFields);
        setUserDefinedFields(userDefinedFields);
        setTestState((prevState) => ({ ...prevState, userDefinedFields }));
      }
    };

    // Read the first chunk
    const blob = file.slice(0, chunkSize);
    reader.readAsText(blob);
  };
  const extractUserDefinedFields = (fileContent) => {
    const lines = fileContent.split('\n');
    const extractedData = { userDefinedFields: {}, data: {} };

    lines.forEach((line) => {
      const fieldMatches = line.match(/\[(.*?)\], (.*?), (\d+(?:\.\d+)?)/);
      if (fieldMatches) {
        const [, field, operation, value] = fieldMatches;
        if (!field.includes('-FAILED') && (operation === 'AverageLatency(us)' || operation === 'MaxLatency(us)' || operation === '95thPercentileLatency(us)' || operation === '99thPercentileLatency(us)' || (field === 'OVERALL' && operation === 'Throughput(ops/sec)'))) {
          // field name preprocessing
          const words = field.split(' ');
          let formatField = words[0].toLowerCase();
          for (let i = 1; i < words.length; i++) {
            formatField += words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
          }
          if (formatField === 'read-modify-write') formatField = 'rmw';
          if (!extractedData.userDefinedFields[formatField]) {
            extractedData.userDefinedFields[formatField] = {};
          }
          extractedData.userDefinedFields[formatField][operation] = parseFloat(value);
        }
      }
      const timeSeriesMatches = line.match(/\[(.*?)\], (\d+), (\d+(?:\.\d+)?)/);
      if (timeSeriesMatches) {
        const [, type, time, latency] = timeSeriesMatches;
        if (time !== '0') {
          if (!extractedData.data[type]) {
            extractedData.data[type] = { time: [], latency: [] };
          }
          extractedData.data[type].time.push(parseInt(time));
          extractedData.data[type].latency.push(parseFloat(latency));
        }
      }
    });

    return extractedData;
  };
  const reformatUserDefinedFields = (originalData) => {
    const reformattedData = {};
    // Map original properties to the desired format
    Object.keys(originalData).forEach((key) => {
      const item = originalData[key];
      const prefix = key;

      Object.keys(item).forEach((subKey) => {
        let newKey = '';

        switch (subKey) {
          case 'Throughput(ops/sec)':
            newKey = 'opsPerSec';
            break;
          case 'AverageLatency(us)':
            newKey = `${prefix}MeanLatency`;
            break;
          case 'MaxLatency(us)':
            newKey = `${prefix}MaxLatency`;
            break;
          case '95thPercentileLatency(us)':
            newKey = `${prefix}P95`;
            break;
          case '99thPercentileLatency(us)':
            newKey = `${prefix}P99`;
            break;
          default:
            break;
        }
        if (newKey) {
          reformattedData[newKey] = item[subKey];
        }
      });
    });
    return reformattedData;
  };
  return (
    <div>
      <div className="input-group pt-3">
        <input type="file" id={`txtFile${id}`} className="form-control" hidden onChange={(e) => handleFileUpload(e)} required />
        <label htmlFor={`txtFile${id}`} className="input-group-text required">
          Upload .txt File Here
        </label>
      </div>
      {userDefinedFields && <pre style={{ fontSize: '8pt' }}>{JSON.stringify(userDefinedFields, null, 2)}</pre>}
    </div>
  );
}

export default TxtForm;
