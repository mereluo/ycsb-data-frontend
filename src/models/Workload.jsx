const columnsForA = ["workloadType", "database", "isTransactional", "platform", "numOfNodes", "isMultiRegion", "numOfRegions", "description", "concurrencyLevel", "recordCounts", "commandLine", "opsPerSec", "readMeanLatency", "readMaxLatency", "readP95", "readP99", "updateMeanLatency", "updateMaxLatency", "updateP95", "updateP99"];
const ATemplate = columnsForA.join(",");

const columnsForB = ["workloadType", "database", "isTransactional", "platform", "numOfNodes", "isMultiRegion", "numOfRegions", "description", "concurrencyLevel", "recordCounts", "commandLine", "opsPerSec", "readMeanLatency", "readMaxLatency", "readP95", "readP99", "updateMeanLatency", "updateMaxLatency", "updateP95", "updateP99"];
const BTemplate = columnsForB.join(",");

const columnsForF = ["workloadType", "database", "isTransactional", "platform", "numOfNodes", "isMultiRegion", "numOfRegions", "description", "concurrencyLevel", "recordCounts", "commandLine", "opsPerSec", "readMeanLatency", "readMaxLatency", "readP95", "readP99", "rmwMeanLatency", "rmwMaxLatency", "rmwP95", "rmwP99"];
const FTemplate = columnsForF.join(",");

export { ATemplate, BTemplate, FTemplate };
