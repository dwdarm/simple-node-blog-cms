import React, { useState, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { postArticle, invalidateArticles } from '../../store/actions/article.action';
import Editor from '../../components/MDEditor';
import CategoriesSideBar from '../../components/CategoriesSideBar';
import TagsSideBar from '../../components/TagsSideBar';
import OptionsSideBar from '../../components/OptionsSideBar';
import InfoDialog from '../../components/InfoDialog';

const Form = ({ dispatch }) => {
  const titleRef = useRef(null);
  const headerRef = useRef(null);
  const descRef = useRef(null);
  const contentRef = useRef(null);
  const [ categories, setCategories ] = useState([]);
  const [ tags, setTags ] = useState([]);
  const [ options, setOptions ] = useState({ 
    isPublished: false, isFeatured: false, isPage: false 
  });
  const [ isSending, setIsSending ] = useState(false);
  const [ error, setError ] = useState({ isError: false, text: '' });
  const history = useHistory();
  
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
  
  const handlePostArticle = () => {
    setIsSending(true);
    dispatch(postArticle({
      title: titleRef.current.value,
      urlToHeader: headerRef.current.value,
      description: descRef.current.value,
      content: contentRef.current.value,
      categories: categories.map(e => parseInt(e)),
      tags: tags.map(e => parseInt(e)),
      ...options
    }, localStorage.getItem('token')))
    .then(json => {
      dispatch(invalidateArticles());
      history.replace('/');
    })
    .catch((err) => {
      setIsSending(false);
      setError({ isError: true, text: err });
    });
  }
  
  return (
    <div style={{marginBottom: '3rem'}}>
      <div className="columns">
      
        <div className="column">
          <div className="field">
            <label className="label">Title</label>
            <div className="control">
              <input ref={titleRef} className="input" type="text" placeholder="Title"/>
            </div>
          </div>
          <div className="field">
            <label className="label">Header</label>
            <div className="control">
              <input ref={headerRef} className="input" type="text" placeholder="Url to header"/>
            </div>
          </div>
          <div className="field">
            <label className="label">Description</label>
            <div className="control">
              <input ref={descRef} className="input" type="text" placeholder="Description"/>
            </div>
          </div>
          <div className="field">
            <label className="label">Content</label>
            <div className="control">
              <div className="content">
                <Editor ref={contentRef} />
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
        </div>
        
      </div>
      
      <InfoDialog 
        text="Creating article..."
        show={isSending} 
      />
      
      <InfoDialog 
        title="Error"
        closeable={true}
        show={error.isError} 
        text={error.text}
        onClose={() => setError({ isError: false, text: '' })}  
      />
      
    </div>
  )
}

export default connect()(Form);
