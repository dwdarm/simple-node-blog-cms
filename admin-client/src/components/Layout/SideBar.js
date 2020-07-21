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
    <div className="pb-2">
      <div style={{padding:'0.75rem'}}>
        <p className="title is-6">Dashboard</p>
      </div>
      <div className="menu">
        <ul className="menu-list">
          <li>
            <NavLink exact to="/" activeClassName="is-active">
              <span className="icon"><i className="fa fa-file-text-o"></i></span>
              <span>Articles</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/categories" activeClassName="is-active">
              <span className="icon"><i className="fa fa-folder-o"></i></span>
              <span>Categories</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/tags" activeClassName="is-active">
              <span className="icon"><i className="fa fa-tags"></i></span>
              <span>Tags</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/setting" activeClassName="is-active">
              <span className="icon"><i className="fa fa-cogs"></i></span>
              <span>Settings</span>
            </NavLink>
          </li>
          <li>
            <a onClick={signOut}>
              <span className="icon"><i className="fa fa-sign-out"></i></span>
              <span>Sign out</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
