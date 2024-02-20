const columnsForTS = ["category", "time", "mean_latency"];
const TSTemplate = columnsForTS.join(",");

const createMetric = (label) => {
    const metric = {
        mean: {
            title: `${label} mean latency`,
            field: `${label}MeanLatency`,
        },
        max: {
            title: `${label} max latency`,
            field: `${label}MaxLatency`,
        },
        p95: {
            title: `${label} percentile 95`,
            field: `${label}P95`,
        },
        p99: {
            title: `${label} percentile 99`,
            field: `${label}P99`,
        },
    };
};

const A = {
    read: createMetric("read"),
    update: createMetric("update"),
};

export { TSTemplate, A };
