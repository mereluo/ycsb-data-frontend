
const Home = () => {
    return (
        <div className="jumbotron">
            <h1 className="display-4">YCSB Database Benchmark</h1>
            <p className="lead">This is a platform for conducting comprehensive performance comparisons between
                transactional and non-transactional workloads across databases like Google Spanner, CockroachDB, and MongoDB.</p>
            <hr className="my-4"/>
            <p>Investigating the performance costs of strong consistency in distributed (SQL)
                databases on a cloud platform.</p>
            <p className="lead">
                <a className="btn btn-primary btn-lg" href="#" role="button">Learn more</a>
            </p>
        </div>);
}

export default Home;