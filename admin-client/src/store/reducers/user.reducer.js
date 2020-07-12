const defaultState = {
  isReqGet: false,
  isReqPut: false,
  isReqDel: false,
  isExist: true,
}

const setReqUsers = (state, id, method, status) => {
  const user = state[id] || { ...defaultState };
  
  return {
    ...state,
    [id]: {
      ...user,
      [`isReq${method}`]: status,
      isExist: true
    }
  }
}

const setExistUsers = (state, id, status) => {
  const user = state[id] || { ...defaultState };
  
  return {
    ...state,
    [id]: {
      ...user,
      isExist: status
    }
  }
}

export default (state = {}, { type, payload }) => {
  switch(type) {
    case 'ADD_USERS':
    case 'ADD_ARTICLES':
    case 'ADD_ARTICLE_LIST':
      return {
        ...state,
        ...payload.users.reduce((acc, current) => {
          return {
            ...acc,
            [current.id]: { ...current, ...defaultState }
          }
        }, {})
      }
      
    case 'SET_AUTH':
      return {
        ...state,
        [payload.user.id]: { ...payload.user, ... defaultState }
      }
      
    case 'SET_REQ_GET_USERS':
      return setReqUsers(state, payload.id, 'Get', payload.status);
    case 'SET_REQ_PUT_USERS':
      return setReqUsers(state, payload.id, 'Put', payload.status);
    case 'SET_REQ_DEL_USERS':
      return setReqUsers(state, payload.id, 'Del', payload.status);
    case 'SET_EXIST_USERS':
      return setExistUsers(state, payload.id, payload.status);
      
    case 'INVALIDATE_USERS':
    case 'INVALIDATE':
      return {}
      
    default:
      return state;
  }
}
