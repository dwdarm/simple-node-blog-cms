import buildUrl from 'build-url';

const requestArticleList = () => {
  return { type: 'REQUEST_ARTICLE_LIST' }
}

const addArticleList = (articles = []) => {
  return { 
    type: 'ADD_ARTICLE_LIST', 
    payload: { 
      articles, 
      users: articles.map(article => article.User)
    } 
  }
}

export const setOptionsArticleList = (options = {}) => {
  return { 
    type: 'SET_OPTIONS_ARTICLE_LIST', 
    payload: options
  }
}

export const invalidateArticleList = () => {
  return { type: 'INVALIDATE_ARTICLE_LIST' }
}

const shouldFetchArticleList = (state) => {
  const { articleList } = state;
  
  if (!articleList.isFetching && articleList.hasMore) {
    return true;
  }
  
  return false;
}

export const getArticleList = (token) => async (dispatch, getState) => {
  const state = getState();
  
  if (!shouldFetchArticleList(state)) {
    return Promise.resolve();
  }
  
  dispatch(requestArticleList());
  
  const query = { page: state.articleList.page }
  if (state.articleList.userId !== 'all') { query.userId = state.articleList.userId }
  if (state.articleList.status !== 'all') { query.status = state.articleList.status }
  if (state.articleList.category !== 'all') { query.categoryId = state.articleList.category }
  if (state.articleList.tag !== 'all') { query.tagId = state.articleList.tag }
  if (state.articleList.sort !== 'all') { query.sort = state.articleList.sort }
  
  const res = await fetch(buildUrl('/admin/api/articles', { queryParams: query }), {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (res.status !== 200) {
    return Promise.reject();
  }
  
  const json = await res.json();
  dispatch(addArticleList(json.data));
  
  return json.data;
}
