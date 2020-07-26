import React, { useState, useEffect, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { 
  updateArticle, 
  getArticle, 
  deleteArticle, 
  invalidateArticles 
} from '../../store/actions/article.action';
import Editor from '../../components/MDEditor';
import CategoriesSideBar from '../../components/CategoriesSideBar';
import TagsSideBar from '../../components/TagsSideBar';
import OptionsSideBar from '../../components/OptionsSideBar';
import InfoDialog from '../../components/InfoDialog';
import PromptDialog from '../../components/PromptDialog';

const Form = ({ article, dispatch }) => {
  const titleRef = useRef(null);
  const headerRef = useRef(null);
  const contentRef = useRef(null);
  const [ categories, setCategories ] = useState([]);
  const [ tags, setTags ] = useState([]);
  const [ options, setOptions ] = useState({ 
    isPublished: false, isFeatured: false, isPage: false 
  });
  const [ isFetched, setIsFetched ] = useState(false);
  const [ error, setError ] = useState({ isError: false, text: '' });
  const [ showDeleteDialog, setShowDeleteDialog ] = useState(false);
  const history = useHistory();
  
  useEffect(() => {
    if (!article) { 
      history.replace('/'); 
    } 
    else {
      if (!isFetched) {
        setIsFetched(true);
        dispatch(getArticle(article.id, localStorage.getItem('token')))
        .then(() => {
          setCategories(article.Categories.map(e => e.id.toString()));
          setTags(article.Tags.map(e => e.id.toString()));
          setOptions({ 
            isPublished: article.isPublished, 
            isFeatured: article.isFeatured,
            isPage: article.isPage
          });
        })
      }
    }
  });
  
  const handleCategoriesChange = e => {
    const target = e.target;
    if (target.checked) {
      if (categories.indexOf(target.value) === -1) {
        setCategories(categories.concat([target.value]));
      }
    } 
    else {
      setCategories(categories.filter(e => e !== target.value));
    }
  }
  
  const handleTagsChange = e => {
    const target = e.target;
    if (target.checked) {
      if (tags.indexOf(target.value) === -1) {
        setTags(tags.concat([target.value]));
      }
    } 
    else {
      setTags(tags.filter(e => e !== target.value));
    }
  }
  
  const handleOptionsChange = e => {
    const target = e.target;
    setOptions({
      ...options,
      [target.name]: target.checked
    })
  }
  
  const handlePostArticle = async () => {
    try {
      await dispatch(updateArticle(article.id, {
        title: titleRef.current.value,
        urlToHeader: headerRef.current.value,
        content: contentRef.current.value,
        categories: categories.map(e => parseInt(e)),
        tags: tags.map(e => parseInt(e)),
        ...options
      }, localStorage.getItem('token')));
      dispatch(invalidateArticles());
      history.replace('/');
    } catch(err) {
      setError({ isError: true, text: err });
    }
  }
  
  const handleDeleteArticle = async () => {
    try {
      await dispatch(deleteArticle(article.id, localStorage.getItem('token')));
      dispatch(invalidateArticles());
      history.replace('/');
    } catch(err) {
      setError({ isError: true, text: err });
    }
  }
  
  if (!article) { return null; }
  
  return (
    <div style={{marginBottom: '3rem'}}>
      <div className="columns">
      
        <div className="column">
          <div className="field">
            <label className="label">Title</label>
            <div className="control">
              <input 
                ref={titleRef} 
                className="input" 
                type="text" 
                placeholder="Title"
                defaultValue={article.title}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Header</label>
            <div className="control">
              <input 
                ref={headerRef} 
                className="input" 
                type="text" 
                placeholder="Url to header"
                defaultValue={article.urlToHeader}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Content</label>
            <div className="control">
              <div className="content">
                <Editor ref={contentRef} defaultValue={article.content} />
              </div>
            </div>
          </div>
        </div>
        
        <div className="column is-one-third">
        
          <CategoriesSideBar 
            values={categories}
            onChange={handleCategoriesChange} 
          />
          
          <TagsSideBar 
            values={tags}
            onChange={handleTagsChange} 
          />
          
          <OptionsSideBar 
            {...options}
            onOptionsChange={handleOptionsChange}
            onSave={handlePostArticle}
          />
          
          <div className="box is-shadowless has-background-light">
            <button 
              className="button is-danger is-fullwidth"
              onClick={() => setShowDeleteDialog(true)}>
              Delete
            </button>
          </div>
          
        </div>
        
      </div>
      
      <InfoDialog text="Loading article..." show={article.isReqGet} />
      <InfoDialog text="Please wait..." show={article.isReqPut || article.isReqDel} />
      
      <InfoDialog 
        title="Error"
        closeable={true}
        show={error.isError} 
        text={error.text}
        onClose={() => setError({ isError: false, text: '' })}  
      />
      
      <PromptDialog 
        text="Are you sure?"
        show={showDeleteDialog} 
        onAccept={handleDeleteArticle}
        onClose={() => setShowDeleteDialog(false)}
      />
      
    </div>
  )
}

const mapStateToProps = ({ user, article, category, tag }, { id }) => {
  if (!article[id]) {
    return { article: null }
  }
  
  if (!article[id].id) {
    return { article: null }
  }
  
  const data = {
    ...article[id],
    User: user[article[id].User],
    Categories: [],
    Tags: []
  }
  
  article[id].Categories.forEach(id => {
    if (category.categories[id]) {
      data.Categories.push(category.categories[id]);
    }
  });
  
  article[id].Tags.forEach(id => {
    if (tag.tags[id]) {
      data.Tags.push(tag.tags[id]);
    }
  });
  
  return {
    article: data
  }
}

export default connect(mapStateToProps)(Form);
