import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { getTags } from '../store/actions/tag.action';
import CheckListBox from './CheckListBox';

const TagsSidebar = ({ tags,  values, onChange, dispatch }) => {
  
  useEffect(() => {
    if (tags.length === 0) {
      const token = localStorage.getItem('token');
      dispatch(getTags(token));
    }
  });
  
  return (
    <CheckListBox 
      title="Tags" 
      values={values}
      data={tags}
      onChange={onChange} 
    />
  );
  
}

const mapStateToProps = ({ tag }) => {
  return {
    tags: Object.keys(tag.tags).map(key => tag.tags[key]),
    isFetching: tag.isFetching,
  }
}

export default connect(mapStateToProps)(TagsSidebar);
