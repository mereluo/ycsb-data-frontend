const HomePage = () => {
    return (
        <div className="jumbotron">
            <h1 className="display-4">YCSB Database Benchmark</h1>
            <p className="lead">This is platform for conducting comprehensive performance comparisons between transactional and non-transactional workloads across databases like Google Spanner, CockroachDB, and MongoDB.</p>
            <hr className="my-4" />
            <p> We have quantified the costs of strong consistency in contemporary Distributed SQL databases. These empirically generated performance data are for system designers to make informed trade-offs when choosing between NoSQL and Distributed SQL databases. </p>
            <p className="lead">
                <a className="btn btn-primary btn-lg" href="#" role="button">
                    Learn more
                </a>
            </p>
        </div>
    );
};

export default HomePage;
