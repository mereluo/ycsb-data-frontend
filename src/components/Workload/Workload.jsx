import { useContext } from "react";
import { FieldContext } from "../../context/FieldContext";

function Workload({ metric }) {
    const { handleDataChange, validateDoubleInput, numberPattern } = useContext(FieldContext);
    const generateDataFields = (metricType) => {
        return Object.keys(metricType).map((key) => (
            <div className="col-3" key={key}>
                <p className={"card-text required"}>{metricType[key].title}</p>
                <input type="text" id={metricType[key].field} className="form-control" onChange={(e) => handleDataChange(metricType[key].field, validateDoubleInput(e.target.value))} pattern={numberPattern} required />
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
                <p className="card-text required">Operations per Second</p>
                <input type="text" id="opsPerSec-input" className="form-control col-3" onChange={(e) => handleDataChange("opsPerSec", validateDoubleInput(e.target.value))} pattern={numberPattern} required />
                {generateRows(metric)}
            </div>
        </div>
    );
}

export default Workload;
