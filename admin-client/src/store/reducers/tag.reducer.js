const defaultState = { tags: {}, isFetching: false, isFetched: false }

export default (state = { ...defaultState }, { type, payload }) => {
  switch(type) {
    case 'ADD_TAGS':
    //case 'ADD_ARTICLES':
      return {
        tags: {
          ...state.tags,
          ...payload.tags.reduce((acc, current) => {
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
    case 'DELETE_TAGS':
      return { 
        ...state, 
        tags: {
          ...Object.keys(state.tags).filter(e => parseInt(e) !== payload.id)
          .reduce((acc, current) => {
            return {
              ...acc,
              [current]: {
                ...state.tags[current]
              }
            }
          }, {})
          
        } 
      }
    case 'REQUEST_TAGS':
      return { ...state, isFetching: true }
    case 'INVALIDATE_TAGS':
    case 'INVALIDATE':
      return { ...defaultState }
    default:
      return state;
  }
}
