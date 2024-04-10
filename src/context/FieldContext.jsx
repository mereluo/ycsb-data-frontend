import { createContext, useState } from "react";
import Papa from "papaparse";

const FieldContext = createContext();

const FieldProvider = ({ children }) => {
    // Variables and states
    const numberPattern = "[0-9]+([.][0-9]+)?";
    const [DBState, setDBState] = useState({});
    const [data, setData] = useState(null);
    const [workloadList, setWorkloadList] = useState([]);

    // Functions for building form and data objects
    const handleDbChange = (fieldName, value) => {
        setDBState((prevState) => ({ ...prevState, [fieldName]: value }));
    };
    const handleDataChange = (fieldName, value) => {
        console.log("in change, fieldname: ", fieldName);
        const newData = { ...DBState.userDefinedFields, [fieldName]: value };
        setDBState((prevState) => ({ ...prevState, userDefinedFields: newData }));
        console.log("in change, dbstate: ", DBState);
    };
    const deleteDataByName = (fieldName) => {
        const { [fieldName]: _, ...newData } = DBState.userDefinedFields;
        setDBState((prevState) => ({ ...prevState, userDefinedFields: newData }));
        console.log("in delete, dbstate: ", DBState);
    };
    // Validate if the input is a valid double
    const validateDoubleInput = (input) => {
        const parsedValue = parseFloat(input);
        return isNaN(parsedValue) ? 1 : Math.max(0, parsedValue);
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
                    setDBState((prevState) => ({ ...prevState, ["timeSeries"]: finalResult }));
                },
            });
        }
    };

    return <FieldContext.Provider value={{ numberPattern, DBState, setDBState, setData, data, workloadList, setWorkloadList, handleDbChange, handleDataChange, deleteDataByName, validateDoubleInput, handleTimeSeriesUpload }}>{children}</FieldContext.Provider>;
};

export { FieldContext, FieldProvider };
