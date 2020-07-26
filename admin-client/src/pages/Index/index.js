import React, { useEffect } from 'react';
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout';
import Articles from './Articles';
import Options from './Options';

const Index = () => {
  return (
    <Layout>
    
      <div className="columns is-vcentered is-mobile">
        <div className="column">
          <h1 className="title">Articles</h1>
        </div>
        <div className="column is-narrow">
          <Link to="/new" className="button is-link is-small">
            <span className="icon"><i className="fa fa-pencil-square-o"></i></span>
            <span>New Article</span>
          </Link>
        </div>
      </div>
      <div className="content"><hr/></div>
      
      <Options/>
      
      <Articles/>
      
    </Layout>
  );
}

export default Index;
