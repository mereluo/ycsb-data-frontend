const columnsForTS = ['category', 'time', 'mean_latency'];
const TSTemplate = columnsForTS.join(',');

const createMetric = (label) => {
  return {
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

const AB = {
  read: createMetric('read'),
  update: createMetric('update'),
};

const AB_T = {
  read: createMetric('read'),
  update: createMetric('update'),
  commit: createMetric('commit'),
  start: createMetric('start'),
  abort: createMetric('abort'),
};

const F = {
  read: createMetric('read'),
  rmw: createMetric('rmw'),
  update: createMetric('update'),
};

const F_T = {
  read: createMetric('read'),
  rmw: createMetric('rmw'),
  update: createMetric('update'),
  commit: createMetric('commit'),
  start: createMetric('start'),
  abort: createMetric('abort'),
};

const G = {
  update: createMetric('update'),
};

const G_T = {
  update: createMetric('update'),
  commit: createMetric('commit'),
  start: createMetric('start'),
  abort: createMetric('abort'),
};

const C = {
  read: createMetric('read'),
};

const C_T = {
  read: createMetric('read'),
  commit: createMetric('commit'),
  start: createMetric('start'),
  abort: createMetric('abort'),
};

const definedWorkloadType = ['A', 'F', 'G', 'C', 'B'];

export { TSTemplate, AB, AB_T, F, F_T, G, G_T, C, C_T, definedWorkloadType };
