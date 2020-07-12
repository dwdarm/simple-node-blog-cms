const defaultState = {
  isReqGet: false,
  isReqPut: false,
  isReqDel: false,
  isExist: true,
}

const setReqArticles = (state, id, method, status) => {
  const article = state[id] || { ...defaultState };
  
  return {
    ...state,
    [id]: {
      ...article,
      [`isReq${method}`]: status,
      isExist: true
    }
  }
}

const setExistArticles = (state, id, status) => {
  const article = state[id] || { ...defaultState };
  
  return {
    ...state,
    [id]: {
      ...article,
      isExist: status
    }
  }
}

export default (state = {}, { type, payload }) => {
  switch(type) {
    case 'ADD_ARTICLE_LIST':
    case 'ADD_ARTICLES':
      return {
        ...state,
        ...payload.articles.reduce((acc, current) => {
          return {
            ...acc,
            [current.id]: {
              ...current,
              ...defaultState,
              User: current.User.id,
              Categories: current.Categories.map(e => e.id),
              Tags: current.Tags.map(e => e.id),
            }
          }
        }, {})
      }
      
    case 'SET_REQ_GET_ARTICLES':
      return setReqArticles(state, payload.id, 'Get', payload.status);
    case 'SET_REQ_PUT_ARTICLES':
      return setReqArticles(state, payload.id, 'Put', payload.status);
    case 'SET_REQ_DEL_ARTICLES':
      return setReqArticles(state, payload.id, 'Del', payload.status);
    case 'SET_EXIST_ARTICLES':
      return setExistArticles(state, payload.id, payload.status);
      
    case 'INVALIDATE_ARTICLES':
    case 'INVALIDATE':
      return {}
      
    default:
      return state;
  }
}
