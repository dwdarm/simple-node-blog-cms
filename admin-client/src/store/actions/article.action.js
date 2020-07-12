import buildUrl from 'build-url';

const addArticles = (articles = []) => {
  return { 
    type: 'ADD_ARTICLES', 
    payload: { 
      articles, 
      users: articles.map(article => article.User)
    } 
  }
}

const setReqGetArticles = (id, status = false) => ({
  type: 'SET_REQ_GET_ARTICLES', payload: { id, status }
});

const setReqPutArticles = (id, status = false) => ({
  type: 'SET_REQ_PUT_ARTICLES', payload: { id, status }
});

const setReqDelArticles = (id, status = false) => ({
  type: 'SET_REQ_DEL_ARTICLES', payload: { id, status }
});

const setExistArticles = (id, status = true) => ({
  type: 'SET_EXIST_ARTICLES', payload: { id, status }
});

export const invalidateArticles = () => ({
  type: 'INVALIDATE_ARTICLES'
});

export const getArticle = (id, token, force = false) => async (dispatch, getState) => {
  const { article } = getState();
  
  if (article[id]) {
    if (article[id].isReqGet || !article[id].isExist) {
      return Promise.resolve();
    }
  }
  
  dispatch(setReqGetArticles(id, true));
  
  const res = await fetch(`/admin/api/articles/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (res.status !== 200) {
    if (res.status === 404) {
      setExistArticles(id, false);
    }
    
    dispatch(setReqGetArticles(id));
    return Promise.reject();
  }
  
  const json = await res.json();
  dispatch(addArticles([json.data]));
  
  return json.data;
}

export const postArticle = (data = {}, token) => async (dispatch) => {
  const res = await fetch('/admin/api/articles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  
  const json = await res.json();
  if (json.status === 'error') {
    return Promise.reject(json.message);
  }
  
  dispatch(addArticles([json.data]));
  
  return json.data;
}

export const updateArticle = (id, data = {}, token) => async (dispatch, getState) => {
  const { article } = getState();
  
  if (article[id]) {
    if (article[id].isReqPut || !article[id].isExist) {
      return Promise.resolve();
    }
  }
  
  dispatch(setReqPutArticles(id, true));
  
  const res = await fetch(`/admin/api/articles/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  
  if (res.status !== 200) {
    if (res.status === 404) {
      setExistArticles(id, false);
    }
    
    dispatch(setReqPutArticles(id));
    return Promise.reject();
  }
  
  const json = await res.json();
  dispatch(addArticles([json.data]));
  
  return json.data;
}

export const deleteArticle = (id, token) => async (dispatch, getState) => {
  const { article } = getState();
  
  if (article[id]) {
    if (article[id].isReqDel || !article[id].isExist) {
      return Promise.resolve();
    }
  }
  
  dispatch(setReqDelArticles(id, true));
  
  const res = await fetch(`/admin/api/articles/${id}`, { 
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (res.status !== 200) {
    if (res.status === 404) {
      setExistArticles(id, false);
    }
    
    dispatch(setReqDelArticles(id));
    return Promise.reject();
  }

}
