import React, { useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { login, getLoggedUser } from '../store/actions/auth.action';

const Login = ({ isAuthenticated, isReqGet, isReqPost, dispatch }) => {
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const history = useHistory();
  
  useEffect(() => {
    if (isAuthenticated === true) {
      history.replace('/');
    }
  });
  
  const handleLogin = async () => {
    try {
      const token = await dispatch(login(usernameRef.current.value, passwordRef.current.value));
      localStorage.setItem('token', token);
      dispatch(getLoggedUser(token));
    } catch(err) {
      
    }
  }
   
  return (
    <div className="columns is-mobile is-centered is-vcentered" style={{minHeight:'100vh'}}>
      <div className="column is-narrow">
        <h1 className="title has-text-centered">Login</h1>
        
        { isReqGet || isReqPost
          ? <div className="notification is-success">
              Authenticating...
            </div>
          : null
        }
        
        <div className="box">
          <div className="field">
            <label className="label">Username</label>
            <div className="control">
              <input ref={usernameRef} className="input" type="text" placeholder="Username"/>
            </div>
          </div>
          <div className="field">
            <label className="label">Password</label>
            <div className="control">
              <input ref={passwordRef} className="input" type="password" placeholder="Password"/>
            </div>
          </div>
          <div className="field">
            <div className="control">
              <div className="columns is-mobile is-vcentered">
                <div className="column is-narrow">
                  <button 
                    className="button is-link"
                    disabled={isReqGet || isReqPost ? true : undefined} 
                    onClick={handleLogin}>
                    Login
                  </button>
                </div>
                <div className="column is-narrow">
                  <a href="/forgot-password">Forgot password?</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = ({ auth }) => {
  return {
    isAuthenticated: auth.isAuthenticated,
    isReqGet: auth.isReqGet,
    isReqPost: auth.isReqPost
  }
}

export default connect(mapStateToProps)(Login);
