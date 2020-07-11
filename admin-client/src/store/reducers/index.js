import { combineReducers } from 'redux';
import authReducer from './auth.reducer';
import userReducer from './user.reducer';
import articleReducer from './article.reducer';
import categoryReducer from './category.reducer';
import tagReducer from './tag.reducer';
import articleListReducer from './article-list.reducer';

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  article: articleReducer,
  category: categoryReducer,
  tag: tagReducer,
  articleList: articleListReducer
});

export default rootReducer;
