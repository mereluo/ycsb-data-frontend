import React from "react";
import { A } from "../../models/Templates";
import Workload from "./Workload";

function WorkloadFactory({ type, test }) {
    const selectTemplate = (type, test) => {
        if (type === "A") {
            if (test === "ycsb") return A;
        }
    };

    return <Workload metric={selectTemplate(type, test)} />;
}

export default WorkloadFactory;
