const defaultState = { 
  userId: null,
  isAuthenticated: false, 
  isReqGet: false, 
  isReqPost: false
}

export default (state = { ...defaultState }, { type, payload }) => {
  switch(type) {
    case 'SET_AUTH':
      return {
        ...state,
        userId: payload.user.id,
        isAuthenticated: true
      }
    case 'SET_REQ_GET_AUTH':
      return { ...state, isReqGet: payload.status }
    case 'SET_REQ_POST_AUTH':
      return { ...state, isReqPost: payload.status }
    case 'INVALIDATE_AUTH':
    case 'INVALIDATE':
      return { ...defaultState }
    default:
      return state;
  }
}
