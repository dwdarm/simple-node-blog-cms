import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Route, useHistory, useLocation } from 'react-router-dom';

const AuthRouteMiddleware = props => {
  const history = useHistory();
  const location = useLocation();
  
  useEffect(() => {
    if (props.isAuthenticated === false) {
      if (location.pathname !== '/login') {
        history.replace('/login');
      }
    }
  });
  
  if (props.isAuthenticated === false) {
    if (location.pathname !== '/login') {
      return null;
    }
  }
  
  return <>{props.children}</>
}

const mapStateToProps = ({ auth }) => ({
  isAuthenticated: auth.isAuthenticated
});

const Middleware = connect(mapStateToProps)(AuthRouteMiddleware);

const AuthRoute = props => {
  return (
    <Route {...props}>
      <Middleware>{props.children}</Middleware>
    </Route>
  );
}

export default AuthRoute;
