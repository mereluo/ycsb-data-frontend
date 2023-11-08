import { useState } from "react";
import Papa from "papaparse";

function Upload() {
    // parsed data in general
    const [parsedData, setParsedData] = useState([]);
    // table Column name
    const [tableRows, setTableRows] = useState([]);
    // values
    const [values, setValues] = useState([]);

    const handleDownload = () => {
        const workloadA = "Column1,Column2,Column3\nValue1,Value2,Value3";
        const workloadB = "Column1,Column2,Column3\nValue1,Value2,Value3";
        const workloadF = "Column1,Column2,Column3\nValue1,Value2,Value3";

        const createTemplate = (template, filename) => {
            // Create a Blob with the CSV content
            const blob = new Blob([template], { type: "text/csv" });

            // Create a URL for the Blob
            const url = window.URL.createObjectURL(blob);

            // Create a temporary anchor element to trigger the download
            const a = document.createElement("a");
            a.href = url;
            a.download = filename + ".csv";
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        };

        createTemplate(workloadA, "workloadA");
        createTemplate(workloadB, "workloadB");
        createTemplate(workloadF, "workloadF");
    };

    const handleUpload = (event) => {
        // Handle the uploaded file here
        const file = event.target.files[0];
        if (file) {
            Papa.parse(event.target.files[0], {
                header: true,
                skipEmptyLines: true,
                complete: function (results) {
                    const rowsArray = [];
                    const valuesArray = [];

                    // Iterating data to get column name and their values
                    results.data.map((d) => {
                        rowsArray.push(Object.keys(d));
                        valuesArray.push(Object.values(d));
                    });
                    // Parsed Data Response in array format
                    setParsedData(results.data);

                    // Filtered Column Names
                    setTableRows(rowsArray[0]);

                    // Filtered Values
                    setValues(valuesArray);
                },
            });
        }
    };

    return (
        <div className="container">
            <h1 className="mt-5">Upload Your Data</h1>

            <div className="mt-4">
                <h4>Download CSV Template</h4>
                <button className="btn btn-outline-info p-3" onClick={handleDownload}>
                    Download Template
                </button>
            </div>
            <div className="mt-4">
                <h4>Upload CSV File</h4>
                <div className="custom-file">
                    <input type="file" className="custom-file-input" id="csvFile" accept=".csv" onChange={handleUpload} />
                    <label className="custom-file-label col-5" htmlFor="csvFile">
                        Choose local file
                    </label>
                </div>
            </div>
            <br />
            <table className="table">
                <thead>
                    <tr>
                        <th>Header</th>
                        <th>Data</th>
                    </tr>
                </thead>
                <tbody>
                    {tableRows.map((row, index) => (
                        <tr key={index}>
                            <th>{row}</th>
                            {values.map((value, i) => (
                                <td key={i}>{value[index]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Upload;
