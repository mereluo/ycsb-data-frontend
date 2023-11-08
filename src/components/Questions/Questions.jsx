import {useState} from "react";
import './questions.css'
function Questions() {
    const DBOption = [
        {id:1, label:"Google Spanner"},
        {id:2, label:"CockroachDB"},
        {id:3, label:"MongoDB"}]


    const [question1Response, setQuestion1Response] = useState(null);

    return (


        <div>

            <div className="card text-center">
                <div className="card-header">
                    Database Options
                </div>

                <div className="card-body">
                    <h5 className="card-title">Please select the database that you want to do the comparison</h5>

                    <div className="form-check">
                        {DBOption.map((item) => (
                            <div key={item.id}>
                                <input className ="form-check-input" type="checkbox" />
                                <label className="form-check-label">
                                    {item.label}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>


            <div className="card text-center">
                <div className="card-header">
                    Database Configuration
                </div>

                <div className="card-body">
                    <h5 className="card-title">Please indicate the database configuration in the following field</h5>

                    <p className="card-text">Is Transactional</p>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1"/>
                        <label className="form-check-label" htmlFor="inlineRadio1">Yes (YCSB+T)</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2"/>
                        <label className="form-check-label" htmlFor="inlineRadio2">No</label>
                    </div>

                    <p className="card-text">Number of Nodes</p>
                    <input type="number" id="number-input" className="form-control " />

                    <p className="card-text">Is MultiRegion</p>

                    <button className="btn btn-primary" onClick={() => setQuestion1Response('yes')}>Yes</button>
                    <button className="btn btn-primary" style={{marginLeft:'5px'}} onClick={() => setQuestion1Response('no')}>No</button>

                    {question1Response === 'yes' && (
                        <div>
                            <p className="card-text">Number of regions</p>
                            <input type="number" id="number-input" className="form-control " />
                        </div>
                    )}
                </div>
            </div>



            <div className="card text-center">
                <div className="card-header">
                    Test Configuration
                </div>

                <div className="card-body">
                    <h5 className="card-title">Please indicate the database configuration in the following field</h5>
                    <p className="card-text">Concurrency Level</p>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="concurrencyOptions" id="inlineRadio1" value="option1"/>
                        <label className="form-check-label" htmlFor="inlineRadio1">64</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="concurrencyOptions" id="inlineRadio2" value="option2"/>
                        <label className="form-check-label" htmlFor="inlineRadio2">128</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="concurrencyOptions" id="inlineRadio3" value="option3"/>
                        <label className="form-check-label" htmlFor="inlineRadio2">256</label>
                    </div>


                    <p className="card-text">Record Counts</p>
                    <input type="number" id="number-input" className="form-control " />
                </div>
            </div>


            <div className="card text-center">
                <div className="card-header">
                    Workload Option
                </div>

                <div className="card-body">
                    <h5 className="card-title">Please indicate the workload you want to test</h5>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="workloadOptions" id="inlineRadio1" value="option1"/>
                        <label className="form-check-label" htmlFor="inlineRadio1">Workload A</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="workloadOptions" id="inlineRadio2" value="option2"/>
                        <label className="form-check-label" htmlFor="inlineRadio2">Workload B</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="workloadOptions" id="inlineRadio3" value="option3"/>
                        <label className="form-check-label" htmlFor="inlineRadio2">Workload F</label>
                    </div>
                </div>
            </div>




        </div>
    );
}

export default Questions;






