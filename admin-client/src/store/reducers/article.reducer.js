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
              User: current.User.id,
              Categories: current.Categories.map(e => e.id),
              Tags: current.Tags.map(e => e.id)
            }
          }
        }, {})
      }
    case 'INVALIDATE_ARTICLES':
    case 'INVALIDATE':
      return {}
    default:
      return state;
  }
}
