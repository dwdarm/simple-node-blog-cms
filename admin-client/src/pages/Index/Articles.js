import React, { useEffect } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { getArticleList } from '../../store/actions/article-list.action';

const ArticleList = ({ data }) => (
  <>
    {data.map(e => (
      <article key={e.id} className="media">
        <div className="media-content">
          <h3 className="title is-4 is-spaced"><Link className="has-text-black-bis" to={`/article-edit/${e.id}`}>{e.title}</Link></h3>
          <div className="level is-mobile">
            <div className="level-left">
              <div className="level-item">
                <p className="subtitle is-7"><Link className="has-text-black-bis" to="/">{e.User.username}</Link> - {e.updatedAt}</p>
              </div>
            </div>
            <div className="level-right">
              <>
                <div className="level-item">
                  {e.isFeatured
                    ? <span className="tag is-info">Featured</span>
                    : null
                  }
                </div>
              </>
              <>
                <div className="level-item">
                  {e.isPage
                    ? <span className="tag is-dark">Page</span>
                    : null
                  }
                </div>
              </>
              <div className="level-item">
                {e.isPublished
                  ? <span className="tag is-success">Published</span>
                  : <span className="tag is-warning">Draft</span>
                }
              </div>
            </div>
          </div>
        </div>
      </article>
    ))}
  </>
);

const Articles = ({ articles, isFetching, hasMore, dispatch }) => {
  useEffect(() => {
    if (articles.length === 0) {
      const token = localStorage.getItem('token');
      dispatch(getArticleList(token));
    }
  });
  
  return (
    <>
      
      <ArticleList data={articles} />
      
      { hasMore && !isFetching
        ? <div className="field is-grouped is-grouped-centered"> 
            <div className="control">
              <button 
                className="button has-text-centered" 
                style={{margin: '3rem auto',}}
                onClick={() => dispatch(getArticleList(localStorage.getItem('token')))}>
                Load more
              </button>
            </div>
          </div>
        : null 
      }
      
      { isFetching
        ? <p className="has-text-centered">Loading...</p>
        : null 
      }
      
    </>
  );
}

const mapStateToProps = ({ user, article, articleList }) => {
  return {
    articles: articleList.ids.map(id => {
      if (article[id]) {
        return {
          ...article[id],
          User: user[article[id].User]
        }
      }
      
      return null;
    }),
    isFetching: articleList.isFetching,
    hasMore: articleList.hasMore
  }
}

export default connect(mapStateToProps)(Articles);
