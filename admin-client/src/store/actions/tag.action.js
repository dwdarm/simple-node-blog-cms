const requestTags = () => {
  return { type: 'REQUEST_TAGS' }
}

const addTags = (tags = []) => {
  return { 
    type: 'ADD_TAGS', 
    payload: { tags }
  }
}

const deleteTags = (id) => {
  return { 
    type: 'DELETE_TAGS', 
    payload: { id }
  }
}

export const invalidateTags = () => {
  return { type: 'INVALIDATE_TAGS' }
}

const shouldFetchTags = ({ tag }) => {
  if (!tag.isFetching && !tag.isFetched) {
    return true;
  }
  
  return false;
}

export const getTags = (token) => async (dispatch, getState) => {
  const state = getState();
  
  if (!shouldFetchTags(state)) {
    return Promise.resolve();
  }
  
  dispatch(requestTags());
  
  const res = await fetch('/admin/api/tags', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (res.status !== 200) {
    return Promise.reject();
  }
  
  const json = await res.json();
  dispatch(addTags(json.data));
  
  return json.data;
}

export const postTag = (data = {}, token) => async (dispatch) => {
  const res = await fetch('/admin/api/tags', {
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
  
  dispatch(addTags([json.data]));
  
  return json.data;
}

export const updateTag = (id, data = {}, token) => async (dispatch) => {
  const res = await fetch(`/admin/api/tags/${id}`, {
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
  
  dispatch(addTags([json.data]));
  
  return json.data;
}

export const deleteTag = (id, token) => async (dispatch) => {
  const res = await fetch(`/admin/api/tags/${id}`, {
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
  
  dispatch(deleteTags(id));

}

