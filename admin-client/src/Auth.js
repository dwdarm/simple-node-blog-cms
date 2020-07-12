import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { getLoggedUser } from './store/actions/auth.action';
import Login from './pages/Login';

const Auth = ({ isAuthenticated, dispatch, children }) => {
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(getLoggedUser(token));
    }
  });
  
  return (
    <>
      { !isAuthenticated 
        ? <Login />
        : <>{children}</>
      }
    </>
  );
}

const mapStateToProps = ({ auth }) => ({
  isAuthenticated: auth.isAuthenticated
});

export default connect(mapStateToProps)(Auth);
