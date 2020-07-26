import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../../components/Layout';
import Form from './Form'

const UpdateArticle = () => {
  const { id } = useParams();
  
  return (
    <Layout>
    
      <div className="columns is-vcentered is-mobile">
        <div className="column">
          <h1 className="title">Update Article</h1>
        </div>
      </div>
      <div className="content"><hr/></div>
      
      <Form id={id} />
      
    </Layout>
  );
}

export default UpdateArticle;
