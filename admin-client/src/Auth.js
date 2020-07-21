import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader-spinner';
import { getLoggedUser } from './store/actions/auth.action';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

const Loading = () => (
  <div 
    className="columns is-centered is-vcentered is-mobile" 
    style={{minHeight:'100vh'}}>
    <div className="column is-narrow">
      <Loader type="Bars" color="#363636" height={80} width={80} />
    </div>
  </div>
);

const Auth = ({ dispatch, children }) => {
  const [ fetched, setFetched ] = useState(false);
  
  useEffect(() => {
    if (!fetched) {
      dispatch(getLoggedUser(localStorage.getItem('token')))
      .finally(() => setFetched(true));
    }
  });
  
  if (!fetched) {
    return <Loading/>;
  }
  
  return <>{children}</>
}

const mapStateToProps = ({ auth }) => {
  return {
    isAuthenticated: auth.isAuthenticated,
    isReqGet: auth.isReqGet,
    isReqPost: auth.isReqPost
  }
}

export default connect(mapStateToProps)(Auth);
