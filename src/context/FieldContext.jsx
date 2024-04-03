import React, { createContext, useState } from "react";
import Papa from "papaparse";

const FieldContext = createContext();

const FieldProvider = ({ children }) => {
    const initialForm = {};
    // Variables and states
    const numberPattern = "[0-9]+([.][0-9]+)?";
    const [formState, setFormState] = useState(initialForm);
    const [data, setData] = useState(null);
    const [formStateList, setFormStateList] = useState([]);

    // Functions for building form and data objects
    const handleInputChange = (fieldName, value) => {
        setFormState((prevState) => ({ ...prevState, [fieldName]: value }));
    };
    const handleDataChange = (fieldName, value) => {
        const newData = { ...formState.userDefinedFields, [fieldName]: value };
        setFormState((prevState) => ({ ...prevState, userDefinedFields: newData }));
    };
    const validateDoubleInput = (input) => {
        // Validate if the input is a valid double
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
                    setFormState((prevState) => ({ ...prevState, ["timeSeries"]: finalResult }));
                },
            });
        }
    };

    return <FieldContext.Provider value={{ numberPattern, formState, setFormState, data, setData, handleInputChange, handleDataChange, validateDoubleInput, handleTimeSeriesUpload, formStateList, setFormStateList }}>{children}</FieldContext.Provider>;
};

export { FieldContext, FieldProvider };
