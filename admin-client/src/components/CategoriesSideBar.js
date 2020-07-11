import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { getCategories } from '../store/actions/category.action';
import CheckListBox from './CheckListBox';

const CategoriesSidebar = ({ categories, values, onChange, dispatch }) => {
  
  useEffect(() => {
    if (categories.length === 0) {
      const token = localStorage.getItem('token');
      dispatch(getCategories(token));
    }
  });
  
  return (
    <CheckListBox 
      title="Categories" 
      values={values}
      data={categories}
      onChange={onChange} 
    />
  );
  
}

const mapStateToProps = ({ category }) => {
  return {
    categories: Object.keys(category.categories).map(key => category.categories[key]),
    isFetching: category.isFetching,
  }
}

export default connect(mapStateToProps)(CategoriesSidebar);
