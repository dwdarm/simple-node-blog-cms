import React, { useEffect } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { setOptionsArticleList } from '../../store/actions/article-list.action';
import { getCategories } from '../../store/actions/category.action';
import { getTags } from '../../store/actions/tag.action';

const Options = ({ 
  categories, tags, isFetching, dispatch, 
  selectedStatus, selectedCategory, selectedTag, selectedSort 
  }) => {
    
  useEffect(() => {
    const token = localStorage.getItem('token');
        
    if (categories.length === 0) {
      dispatch(getCategories(token));
    }
    
    if (tags.length === 0) {
      dispatch(getTags(token));
    }
    
  });
  
  return (
      <div className="columns is-mobile">
      
        <div className="column is-narrow">
          <div className="select is-small">
            <select 
              disabled={isFetching ? true : undefined}
              defaultValue={selectedStatus}
              onChange={e => dispatch(setOptionsArticleList({ status: e.target.value }))}>
              <option value="all">All articles</option>
              <option value="published">Published articles</option>
              <option value="draft">Draft articles</option>
            </select>
          </div>
        </div>
        
        <div className="column is-narrow">
          <div className="select is-small">
            <select 
              disabled={isFetching ? true : undefined}
              defaultValue={selectedCategory}
              onChange={e => dispatch(setOptionsArticleList({ category: e.target.value }))}>
              <option value="all">All categories</option>
              {categories.map(e => (
                <option key={e.id} value={e.id}>{e.title}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="column is-narrow">
          <div className="select is-small">
            <select 
              disabled={isFetching ? true : undefined}
              defaultValue={selectedTag}
              onChange={e => dispatch(setOptionsArticleList({ tag: e.target.value }))}>
              <option value="all">All tags</option>
              {tags.map(e => (
                <option key={e.id} value={e.id}>{e.title}</option>
              ))}
            </select>
          </div>
        </div>
        
      </div>
  );
}

const mapStateToProps = ({ article, articleList, category, tag }) => {
  return {
    categories: Object.keys(category.categories).map(key => category.categories[key]),
    tags: Object.keys(tag.tags).map(key => tag.tags[key]),
    selectedStatus: articleList.status,
    selectedCategory: articleList.category,
    selectedTag: articleList.tag,
    selectedSort: articleList.sort,
    isFetching: article.isFetching
  }
}

export default connect(mapStateToProps)(Options);
