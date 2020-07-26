import React from 'react';
import { Switch, Route, Link, useRouteMatch, useLocation, useHistory } from 'react-router-dom';
import Account from './Account';
import Password from './Password';
import Layout from '../../components/Layout';

const Setting = () => {
  const { path, url } = useRouteMatch();
  const { pathname } = useLocation();
  const history = useHistory();
  
  return (
    <Layout>
    
      <div className="columns is-vcentered is-mobile">
        <div className="column">
          <h1 className="title">Settings</h1>
        </div>
        <div className="column is-narrow">
          <button 
            className="button is-small"
            onClick={() => history.goBack()}>
            Back
          </button>
        </div>
      </div>
      
      <div className="tabs">
        <ul>
          <li className={pathname === '/setting' ? 'is-active' : ''}>
            <Link to={url}>Account</Link>
          </li>
          <li className={pathname === '/setting/password' ? 'is-active' : ''}>
            <Link to={`${url}/password`}>Password</Link>
          </li>
        </ul>
      </div>
      
      <div style={{padding: '0 1rem'}}>
        <Switch>
          <Route path={`${path}/password`}><Password /></Route>
          <Route exact path={path}><Account /></Route>
        </Switch>
      </div>
      
    </Layout>
  );
}

export default Setting;
