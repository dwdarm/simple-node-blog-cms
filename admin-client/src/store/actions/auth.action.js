const setReqGetAuth = (status = false) => {
  return { type: 'SET_REQ_GET_AUTH', payload: { status } }
}

const setReqPostAuth = (status = false) => {
  return { type: 'SET_REQ_POST_AUTH', payload: { status } }
}

const setAuth = (user = null) => {
  return { type: 'SET_AUTH', payload: { user } }
}

export const login = (username, password) => async (dispatch, getState) => {
  const { auth } = getState();
  
  if (auth.isAuthenticated || auth.isReqPost) {
    return Promise.resolve();
  }
  
  dispatch(setReqPostAuth(true));
  
  const res = await fetch('/admin/api/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  });
  
  if (res.status !== 200) {
    dispatch(setReqPostAuth());
    return Promise.reject();
  }
  
  const json = await res.json();
  dispatch(setReqPostAuth());
  
  return json.data.token; 
}

export const getLoggedUser = (token) => async (dispatch, getState) => {
  const { auth } = getState();
  
  if (auth.isAuthenticated || auth.isReqGet) {
    return Promise.resolve();
  }
  
  dispatch(setReqGetAuth(true));
  
  const res = await fetch('/admin/api/users/me', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (res.status !== 200) {
    dispatch(setReqGetAuth());
    return Promise.reject();
  }
  
  const json = await res.json();
  dispatch(setAuth(json.data));
  dispatch(setReqGetAuth());
  
  return json.data;
}
