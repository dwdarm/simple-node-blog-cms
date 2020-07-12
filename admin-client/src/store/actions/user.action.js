import buildUrl from 'build-url';

const addUsers = (users = []) => {
  return { 
    type: 'ADD_USERS', 
    payload: { users } 
  }
}

export const invalidateUsers = () => {
  return { type: 'INVALIDATE_USERS' }
}

export const updateUser = (id, data = {}, token) => async (dispatch) => {
  const res = await fetch(`/admin/api/users/${id}`, {
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
  dispatch(addUsers([json.data]));
  
  return json.data;
}
