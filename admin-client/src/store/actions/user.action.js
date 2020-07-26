import buildUrl from 'build-url';

const addUsers = (users = []) => {
  return { 
    type: 'ADD_USERS', 
    payload: { users } 
  }
}

const setReqGetUsers = (id, status = false) => ({
  type: 'SET_REQ_GET_USERS', payload: { id, status }
});

const setReqPutUsers = (id, status = false) => ({
  type: 'SET_REQ_PUT_USERS', payload: { id, status }
});

const setReqDelUsers = (id, status = false) => ({
  type: 'SET_REQ_DEL_USERS', payload: { id, status }
});

const setExistUsers = (id, status = true) => ({
  type: 'SET_EXIST_USERS', payload: { id, status }
});

export const invalidateUsers = () => {
  return { type: 'INVALIDATE_USERS' }
}

export const updateUser = (id, data = {}, token) => async (dispatch, getState) => {
  const { user } = getState();
  
  if (user[id]) {
    if (user[id].isReqPut || !user[id].isExist) {
      return Promise.resolve();
    }
  }
  
  dispatch(setReqPutUsers(id, true));
  
  const res = await fetch(`/admin/api/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  
  if (res.status !== 200) {
    if (res.status === 404) {
      setExistUsers(id, false);
    }
    
    dispatch(setReqPutUsers(id));
    return Promise.reject();
  }
  
  const json = await res.json();
  dispatch(addUsers([json.data]));
  
  return json.data;
}
