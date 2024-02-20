import React, { createContext, useState } from "react";
import Papa from "papaparse";

const FieldContext = createContext();

const FieldProvider = ({ children }) => {
    // Variables and states
    const numberPattern = "[0-9]+([.][0-9]+)?";
    const [formState, setFormState] = useState({
        workloadType: "",
        updateType: "",
        userDefinedFields: null,
        timeSeries: null,

        concurrencyLevel: null,
        recordCounts: null,
        commandLine: "",

        type: "",
        platform: "",
        numOfNodes: null,
        isMultiRegional: null,
        isCoLocated: null,
        locationDetails: "",
        description: "",

        database: "",
    });
    const [data, setData] = useState(null);

    // Functions for building form and data objects
    const handleInputChange = (fieldName, value) => {
        setFormState((prevState) => ({ ...prevState, [fieldName]: value }));
    };
    const handleDataChange = (setData, fieldName, value) => {
        setData((prevState) => ({ ...prevState, [fieldName]: value }));
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

    return <FieldContext.Provider value={{ numberPattern, formState, setFormState, data, setData, handleInputChange, handleDataChange, validateDoubleInput, handleTimeSeriesUpload }}>{children}</FieldContext.Provider>;
};

export { FieldContext, FieldProvider };
