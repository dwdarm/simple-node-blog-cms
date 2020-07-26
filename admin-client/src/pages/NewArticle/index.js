import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import Form from './Form'

const NewArticle = () => {
  return (
    <Layout>
    
      <div className="columns is-vcentered is-mobile">
        <div className="column">
          <h1 className="title">New Article</h1>
        </div>
      </div>
      <div className="content"><hr/></div>
      
      <Form />
      
    </Layout>
  );
}

export default NewArticle;
