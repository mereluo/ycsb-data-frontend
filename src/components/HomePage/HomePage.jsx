import { Typography, Link } from '@mui/joy';
const HomePage = () => {
  return (
    <div>
      <div className="jumbotron">
        <h1>YCSB Database Benchmark</h1>
        <Typography className="mt-2" color="neutral" level="title-lg">
          YCSB is a platform for conducting comprehensive performance comparisons between transactional and non-transactional workloads across databases like Google Spanner, CockroachDB, and MongoDB.
        </Typography>
        <hr className="my-4" />
        <Typography color="neutral" level="title-md">
          We have quantified the costs of strong consistency in contemporary Distributed SQL databases. These empirically generated performance data are for system designers to make informed trade-offs when choosing databases.
        </Typography>
        <p className="mt-3">
          <Link underline="hover" variant="soft" href="#">
            Learn more
          </Link>
        </p>
        <p className="mt-3">
          <Typography>If you want to upload your own dataset, please login with admin credentials</Typography>
        </p>
      </div>
    </div>
  );
};

export default HomePage;
