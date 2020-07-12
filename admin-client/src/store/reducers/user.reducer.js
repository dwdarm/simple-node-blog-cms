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
            [current.id]: {
              ...current
            }
          }
        }, {})
      }
    case 'SET_AUTH':
      return {
        ...state,
        [payload.user.id]: { ...payload.user }
      }
    case 'INVALIDATE_USERS':
    case 'INVALIDATE':
      return {}
    default:
      return state;
  }
}
