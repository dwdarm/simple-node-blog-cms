const defaultState = { isFetching: false, isAuthenticated: false, userId: null }

export default (state = { ...defaultState }, { type, payload }) => {
  switch(type) {
    case 'SET_AUTH':
      return {
        isAuthenticated: true,
        userId: payload.user.id,
        isFetching: false
      }
    case 'REQUEST_AUTH':
      return { ...state, isFetching: true }
    case 'INVALIDATE_AUTH':
    case 'INVALIDATE':
      return { ...defaultState }
    default:
      return state;
  }
}
