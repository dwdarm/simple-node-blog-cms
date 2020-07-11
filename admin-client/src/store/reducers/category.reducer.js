const defaultState = { categories: {}, isFetching: false, isFetched: false }

export default (state = { ...defaultState }, { type, payload }) => {
  switch(type) {
    case 'ADD_CATEGORIES':
    //case 'ADD_ARTICLES':
      return {
        categories: {
          ...state.categories,
          ...payload.categories.reduce((acc, current) => {
            return {
              ...acc,
              [current.id]: {
                ...current
              }
            }
          }, {})
        },
        isFetching: false,
        isFetched: true
      }
    case 'DELETE_CATEGORIES':
      return { 
        ...state, 
        categories: {
          ...Object.keys(state.categories).filter(e => parseInt(e) !== payload.id)
          .reduce((acc, current) => {
            return {
              ...acc,
              [current]: {
                ...state.categories[current]
              }
            }
          }, {})
          
        } 
      }
    case 'REQUEST_CATEGORIES':
      return { ...state, isFetching: true }
    case 'INVALIDATE_CATEGORIES':
    case 'INVALIDATE':
      return { ...defaultState }
    default:
      return state;
  }
}
