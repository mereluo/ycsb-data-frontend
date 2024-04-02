import React, { useState } from "react";

function BatchUpload() {
    const [userDefinedFields, setUserDefinedFields] = useState(null);
    const [rawContent, setRawContent] = useState("");

    const handleFileUpload = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        const reader = new FileReader();

        const chunkSize = 30 * 1024; // 10KB
        let fileContent = "";

        reader.onload = async (event) => {
            const content = event.target.result;
            fileContent += content;
            setRawContent((prevContent) => prevContent + content);

            // Continue reading next chunk
            if (file.size > reader.offset) {
                const blob = file.slice(reader.offset, reader.offset + chunkSize);
                reader.readAsText(blob);
            } else {
                // Extract user-defined fields
                const extractedData = extractUserDefinedFields(fileContent);

                setUserDefinedFields(reformatUserDefinedFields(extractedData));
            }
        };

        // Read the first chunk
        const blob = file.slice(0, chunkSize);
        reader.readAsText(blob);
    };

    const extractUserDefinedFields = (fileContent) => {
        const lines = fileContent.split("\n");
        const extractedData = {};

        lines.forEach((line) => {
            const matches = line.match(/\[(.*?)\], (.*?), (\d+(?:\.\d+)?)/);
            if (matches) {
                const [, field, operation, value] = matches;
                if (!field.includes("-FAILED") && (operation === "AverageLatency(us)" || operation === "MaxLatency(us)" || operation === "MinLatency(us)" || operation === "95thPercentileLatency(us)" || operation === "99thPercentileLatency(us)" || (field === "OVERALL" && operation === "Throughput(ops/sec)"))) {
                    // field name preprocessing
                    const words = field.split(" ");
                    let formatField = words[0].toLowerCase();
                    for (let i = 1; i < words.length; i++) {
                        formatField += words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
                    }
                    if (formatField === "read-modify-write") formatField = "rmw";
                    if (!extractedData[formatField]) {
                        extractedData[formatField] = {};
                    }
                    extractedData[formatField][operation] = parseFloat(value);
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
                let newKey = "";

                switch (subKey) {
                    case "Throughput(ops/sec)":
                        newKey = "opsPerSec";
                        break;
                    case "AverageLatency(us)":
                        newKey = `${prefix}MeanLatency`;
                        break;
                    case "MinLatency(us)":
                        newKey = `${prefix}MinLatency`;
                        break;
                    case "95thPercentileLatency(us)":
                        newKey = `${prefix}P95`;
                        break;
                    case "99thPercentileLatency(us)":
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
            <h2>Upload a text file</h2>
            <input type="file" onChange={(e) => handleFileUpload(e)} />
            {/* <div>
                <h3>File content:</h3>
                <pre>{rawContent}</pre>
            </div> */}
            {userDefinedFields && (
                <div>
                    <h3>User Defined Fields:</h3>
                    <pre>{JSON.stringify(userDefinedFields, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}

export default BatchUpload;
