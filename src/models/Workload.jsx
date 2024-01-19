const columnsForA = ["workloadType", "database", "isTransactional", "platform", "numOfNodes", "isMultiRegion", "numOfRegions", "description", "concurrencyLevel", "recordCounts", "commandLine", "opsPerSec", "readMeanLatency", "readMaxLatency", "readP95", "readP99", "updateMeanLatency", "updateMaxLatency", "updateP95", "updateP99"];
const ATemplate = columnsForA.join(",");

export { ATemplate };
