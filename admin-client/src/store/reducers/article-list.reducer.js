const defaultState = {
  ids: [], 
  page: 1, 
  isFetching: false, 
  hasMore: true,
  userId: 'all',
  status: 'all',
  category: 'all',
  tag: 'all',
  sort: 'updated_desc'
}

export default (state = { ...defaultState }, { type, payload }) => {
    
  switch(type) {
    case 'ADD_ARTICLE_LIST':
      return {
        ...state,
        ids: state.ids.concat(payload.articles.map(e => e.id)),
        hasMore: payload.articles.length > 0,
        page: state.page + 1,
        isFetching: false
      }
    case 'SET_OPTIONS_ARTICLE_LIST':
      return {
        ...defaultState,
        userId: payload.userId || state.userId,
        status: payload.status || state.status,
        category: payload.category || state.category,
        tag: payload.tag || state.tag,
        sort: payload.sort || state.sort
      }
    case 'REQUEST_ARTICLE_LIST':
      return { ...state, isFetching: true }
    case 'INVALIDATE_ARTICLE_LIST':
      return { 
        ...defaultState,
        ...state,
      }
    case 'INVALIDATE_ARTICLES':
    case 'INVALIDATE':
      return { ...defaultState }
    default:
      return state;
  }
  
}
