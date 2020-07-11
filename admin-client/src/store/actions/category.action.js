const requestCategories = () => {
  return { type: 'REQUEST_CATEGORIES' }
}

const addCategories = (categories = []) => {
  return { 
    type: 'ADD_CATEGORIES', 
    payload: { categories }
  }
}

const deleteCategories = (id) => {
  return { 
    type: 'DELETE_CATEGORIES', 
    payload: { id }
  }
}

export const invalidateCategories = () => {
  return { type: 'INVALIDATE_CATEGORIES' }
}

const shouldFetchCategories = ({ category }) => {
  if (!category.isFetching && !category.isFetched) {
    return true;
  }
  
  return false;
}

export const getCategories = (token) => async (dispatch, getState) => {
  const state = getState();
  
  if (!shouldFetchCategories(state)) {
    return Promise.resolve();
  }
  
  dispatch(requestCategories());
  
  const res = await fetch('/admin/api/categories', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (res.status !== 200) {
    return Promise.reject();
  }
  
  const json = await res.json();
  dispatch(addCategories(json.data));
  
  return json.data;
}

export const postCategory = (data = {}, token) => async (dispatch) => {
  const res = await fetch('/admin/api/categories', {
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
  
  dispatch(addCategories([json.data]));
  
  return json.data;
}

export const updateCategory = (id, data = {}, token) => async (dispatch) => {
  const res = await fetch(`/admin/api/categories/${id}`, {
    method: 'PUT',
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
  
  dispatch(addCategories([json.data]));
  
  return json.data;
}

export const deleteCategory = (id, token) => async (dispatch) => {
  const res = await fetch(`/admin/api/categories/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  
  const json = await res.json();
  if (json.status === 'error') {
    return Promise.reject(json.message);
  }
  
  dispatch(deleteCategories(id));

}
