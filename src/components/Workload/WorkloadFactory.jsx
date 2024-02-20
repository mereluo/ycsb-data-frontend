import React from "react";
import { AB_T, AB, F, F_T } from "../../models/Templates";
import Workload from "./Workload";

function WorkloadFactory({ type, test }) {
    const selectTemplate = (type, test) => {
        if (test === "ycsb") {
            if (type === "A" || type === "B") return AB;
            if (type === "F") return F;
        }
        if (test === "ycsb-t") {
            if (type === "A" || type === "B") return AB_T;
            if (type === "F") return F_T;
        }
    };
    return <Workload metric={selectTemplate(type, test)} />;
}

export default WorkloadFactory;
