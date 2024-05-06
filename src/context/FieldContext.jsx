import { createContext, useState } from 'react';
import Papa from 'papaparse';

const FieldContext = createContext();

const FieldProvider = ({ children }) => {
  // Variables and states
  const numberPattern = '[0-9]+([.][0-9]+)?';
  const [DBState, setDBState] = useState({});
  const [data, setData] = useState(null);
  const [workloadList, setWorkloadList] = useState([]);

  // Functions for building form and data objects
  const handleDbChange = (fieldName, value) => {
    setDBState((prevState) => ({ ...prevState, [fieldName]: value }));
  };
  const handleDataChange = (fieldName, value) => {
    const newData = { ...DBState.userDefinedFields, [fieldName]: value };
    setDBState((prevState) => ({ ...prevState, userDefinedFields: newData }));
  };
  const deleteDataByName = (fieldName) => {
    if (DBState.userDefinedFields) {
      const { [fieldName]: _, ...newData } = DBState.userDefinedFields;
      setDBState((prevState) => ({ ...prevState, userDefinedFields: newData }));
    }
  };
  // Validate if the input is a valid double
  const validateDoubleInput = (input) => {
    const parsedValue = parseFloat(input);
    return isNaN(parsedValue) ? 1 : Math.max(0, parsedValue);
  };

  return <FieldContext.Provider value={{ numberPattern, DBState, setDBState, setData, data, workloadList, setWorkloadList, handleDbChange, handleDataChange, deleteDataByName, validateDoubleInput }}>{children}</FieldContext.Provider>;
};

export { FieldContext, FieldProvider };
