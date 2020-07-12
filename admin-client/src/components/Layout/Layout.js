import React from 'react';
import SideBar from './SideBar';

export default ({children}) => (
  <div className="columns is-gapless" style={{minHeight: '100vh'}}>
    <div className="sidebar column is-narrow has-background-light">
      <SideBar/>
    </div>
    <div className="column">
      <div className="container" style={{padding:'0.75rem 1.25rem'}}>
        {children}
      </div>
    </div>
  </div>
);
