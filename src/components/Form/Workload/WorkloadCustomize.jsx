import { useContext, useState } from "react";
import { FieldContext } from "../../../context/FieldContext";
import { Input, Button } from "@mui/joy";

function WorkloadCustomize({ type }) {
    const { handleDataChange, validateDoubleInput, numberPattern, deleteDataByName } = useContext(FieldContext);
    const [fieldNames, setFieldNames] = useState([]);

    const addField = () => {
        const newFields = [...fieldNames, ""];
        setFieldNames(newFields);
    };
    const deleteField = (index) => {
        deleteDataByName(fieldNames[index]);
        const newFields = [...fieldNames];
        newFields.splice(index, 1);
        setFieldNames(newFields);

        console.log("In delete, fieldNames: ", fieldNames);
    };
    const handleFieldChange = (index, fieldName) => {
        const newFields = [...fieldNames];
        newFields[index] = fieldName;
        setFieldNames(newFields);
        console.log("In change, fieldNames: ", fieldNames);
    };
    return (
        <div className="card-body">
            <p className="card-text required">Operations per Second</p>
            <Input variant="outlined" color="neutral" size="sm" type="text" id="opsPerSec-input" className="form-control col-3" onChange={(e) => handleDataChange("opsPerSec", validateDoubleInput(e.target.value))} pattern={numberPattern} required />

            {fieldNames.map((field, index) => (
                <div key={index}>
                    <div className="row">
                        <div className="col-4">
                            <p className="card-text required">Field Name</p>
                            <Input variant="outlined" color="neutral" size="sm" type="text" id={`field-${index}-name-input`} className="form-control" onChange={(e) => handleFieldChange(index, e.target.value)} />
                        </div>
                        <div className="col-4">
                            <p className="card-text required">Field Value</p>
                            <Input variant="outlined" color="neutral" size="sm" type="text" id={`field-${index}-value-input`} className="form-control " onChange={(e) => handleDataChange(fieldNames[index], validateDoubleInput(e.target.value))} pattern={numberPattern} placeholder="float number" />
                        </div>
                        <Button className="col-1 mt-4" variant="soft" color="danger" onClick={() => deleteField(index)}>
                            Delete
                        </Button>
                    </div>
                </div>
            ))}
            <Button className="mt-3" variant="soft" onClick={addField}>
                Add Field
            </Button>
        </div>
    );
}

export default WorkloadCustomize;
