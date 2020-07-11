import React, { useRef } from 'react';
import { connect } from 'react-redux';
import { login, getLoggedUser } from '../store/actions/auth.action';

const Login = ({dispatch}) => {
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  
  const handleLogin = () => {
    dispatch(login(usernameRef.current.value, passwordRef.current.value))
    .then(token => {
      localStorage.setItem('token', token);
      dispatch(getLoggedUser(token));
    });
  }
   
  return (
    <div className="columns is-centered is-vcentered" style={{minHeight:'100vh'}}>
      <div className="column is-narrow">
        <h1 className="title has-text-centered">Login</h1>
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
              <button className="button is-link" onClick={handleLogin}>Login</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default connect()(Login);
