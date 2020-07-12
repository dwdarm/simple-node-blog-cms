import React from 'react';
import { NavLink, useHistory } from 'react-router-dom';

export default () => {
  const history = useHistory();
  
  const signOut = e => {
    e.preventDefault();
    localStorage.removeItem('token');
    location.replace('/');
  }
  
  return (
    <div>
      <div style={{padding:'0.75rem'}}>
        <p className="title is-6">Dashboard</p>
      </div>
      <div className="menu">
        <ul className="menu-list">
          <li><NavLink exact to="/" activeClassName="is-active">Articles</NavLink></li>
          <li><NavLink to="/categories" activeClassName="is-active">Categories</NavLink></li>
          <li><NavLink to="/tags" activeClassName="is-active">Tags</NavLink></li>
          <li><NavLink to="/setting" activeClassName="is-active">Settings</NavLink></li>
          <li><a onClick={signOut}>Sign out</a></li>
        </ul>
      </div>
    </div>
  );
}
