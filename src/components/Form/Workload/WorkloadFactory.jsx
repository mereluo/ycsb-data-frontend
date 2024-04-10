import { AB, AB_T, F, F_T, G, C, G_T, C_T } from "../../../models/Templates";
import Workload from "./Workload";

function WorkloadFactory({ type, test }) {
    const selectTemplate = (type, test) => {
        if (test === "ycsb" || test === "ycsb-r") {
            if (type === "A" || type === "B") return AB;
            if (type === "F") return F;
            if (type === "G") return G;
            if (type === "C") return C;
        }
        if (test === "ycsb-t") {
            if (type === "A" || type === "B") return AB_T;
            if (type === "F") return F_T;
            if (type === "G") return G_T;
            if (type === "C") return C_T;
        }
    };
    return <Workload metric={selectTemplate(type, test)} />;
}

export default WorkloadFactory;
