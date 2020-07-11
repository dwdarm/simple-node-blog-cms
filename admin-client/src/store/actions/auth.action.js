const requestAuth = () => {
  return { type: 'REQUEST_AUTH' }
}

const setAuth = (user = null) => {
  return { type: 'SET_AUTH', payload: { user } }
}

export const login = (username, password) => async (dispatch) => {
  const res = await fetch('/admin/api/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  });
  
  if (res.status !== 200) {
    return Promise.reject();
  }
  
  const json = await res.json();
  
  return json.data.token; 
}

export const getLoggedUser = (token) => async (dispatch, getState) => {
  const { auth } = getState();
  
  if (auth.isAuthenticated || auth.isFetching) {
    return Promise.resolve();
  }
  
  dispatch(requestAuth());
  
  const res = await fetch('/admin/api/users/me', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (res.status !== 200) {
    return Promise.reject();
  }
  
  const json = await res.json();
  dispatch(setAuth(json.data));
  
  return json.data;
}
