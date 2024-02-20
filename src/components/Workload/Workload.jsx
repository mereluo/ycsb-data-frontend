import React from "react";
import { FieldContext } from "../../context/FieldContext";

function Workload({ metric }) {
    const { handleDataChange, validateDoubleInput, setData, numberPattern } = useContext(FieldContext);
    const generateDataFields = (metricType) => {
        return Object.keys(metricType).map((key) => (
            <div className="col-3" key={key}>
                <p className="card-text">{metricType[key].title}</p>
                <input type="text" id={metricType[key].field} className="form-control" onChange={(e) => handleDataChange(setData, metricType[key].field, validateDoubleInput(e.target.value))} pattern={numberPattern} />
            </div>
        ));
    };
    const generateRows = (metricObject) => {
        return Object.keys(metricObject).map((metricType) => (
            <div className="row" key={metricType}>
                {generateDataFields(metricObject[metricType])}
            </div>
        ));
    };
    return (
        <div>
            <div className="card-body">
                <p className="card-text">Operations per Second</p>
                <input type="text" id="opsPerSec-input" className="form-control col-3" onChange={(e) => handleDataChange(setData, "opsPerSec", validateDoubleInput(e.target.value))} pattern={numberPattern} />
                {generateRows(metric)}
            </div>
        </div>
    );
}

export default Workload;
