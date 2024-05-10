import { Typography, Link, Input, FormLabel, Button } from '@mui/joy';
import { FieldContext } from '../../context/FieldContext';
import { useContext, useState } from 'react';
const HomePage = () => {
  const { isLogin, setIsLogin } = useContext(FieldContext);
  const [user, setUser] = useState({});
  const [message, setMessage] = useState('');

  const handleChange = (val, key) => {
    const update = { ...user, [key]: val };
    setUser(update);
  };

  const validateLogin = (input) => {
    if (input.name === import.meta.env.VITE_NAME && input.password === import.meta.env.VITE_PASSWORD) {
      document.cookie = 'isLoggedIn=true;max-age=3600';
      setIsLogin(true);
      return '';
    }
    return 'Error: username or/and password is not valid';
  };

  const logout = () => {
    document.cookie = 'isLoggedIn=;max-age=0';
    setIsLogin(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const res = validateLogin(user);
    setMessage(res);
  };

  return (
    <div>
      <div className="jumbotron home">
        <h1>YCSB Database Benchmark</h1>
        <Typography className="mt-2" color="neutral" level="body-lg">
          YCSB is a platform for conducting comprehensive performance comparisons between transactional and non-transactional workloads across databases like Google Spanner, CockroachDB, and MongoDB.
        </Typography>
        <hr className="my-4" />
        <Typography color="neutral" level="body-lg">
          We have quantified the costs of strong consistency in contemporary Distributed SQL databases. These empirically generated performance data are for system designers to make informed trade-offs when choosing databases.
        </Typography>
        <Link className="mt-3 mb-3" underline="hover" variant="soft" href="#">
          Learn more
        </Link>
      </div>
      <div className="jumbotron bg-light login">
        <h3>Login</h3>
        <Typography color="neutral" level="body-md">
          To upload datasets, please log in with credentials
        </Typography>
        <hr className="my-3" />
        {!isLogin ? (
          <form className="row mt-2" onSubmit={(e) => handleSubmit(e)}>
            <div className="col-2">
              <FormLabel>username</FormLabel>
              <Input onChange={(e) => handleChange(e.target.value, 'name')} required />
            </div>
            <div className="col-2">
              <FormLabel>password</FormLabel>
              <Input type="password" onChange={(e) => handleChange(e.target.value, 'password')} required />
            </div>
            <Button className="col-2 mt-3 ml-3" variant="outlined" type="submit">
              submit
            </Button>
            <Typography className="mt-2" color="danger" level="body-sm">
              {message}
            </Typography>
          </form>
        ) : (
          <div>
            <Button variant="outlined" color="primary" onClick={logout}>
              Log Out
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
