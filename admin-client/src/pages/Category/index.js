import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import Categories from './Categories';

const Category = () => {
  return (
    <Layout>
      <Categories/>
    </Layout>
  );
}

export default Category;
