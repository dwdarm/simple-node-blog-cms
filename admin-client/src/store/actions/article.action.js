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

export const invalidateArticles = () => {
  return { type: 'INVALIDATE_ARTICLES' }
}

export const getArticle = (id, token) => async (dispatch) => {
  const res = await fetch(`/admin/api/articles/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (res.status !== 200) {
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

export const updateArticle = (id, data = {}, token) => async (dispatch) => {
  const res = await fetch(`/admin/api/articles/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  
  if (res.status !== 200) {
    return Promise.reject();
  }
  
  const json = await res.json();
  dispatch(addArticles([json.data]));
  
  return json.data;
}

export const deleteArticle = (id, token) => async (dispatch) => {
  const res = await fetch(`/admin/api/articles/${id}`, { 
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (res.status !== 200) {
    return Promise.reject();
  }

}
