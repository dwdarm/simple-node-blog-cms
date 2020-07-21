import React from 'react';
import { Provider } from 'react-redux';
import configureStore from './store';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Auth from './Auth';
import AuthRoute from './AuthRoute';
import Index from './pages/Index';
import Category from './pages/Category';
import Tag from './pages/Tag';
import NewArticle from './pages/NewArticle';
import UpdateArticle from './pages/UpdateArticle';
import Setting from './pages/Setting';
import Login from './pages/Login';

const store = configureStore();

export default class App extends React.Component {

  render() {
    return (
      <Provider store={store}>
        <Auth>
          <BrowserRouter>
            <Switch>
              <AuthRoute path="/article-edit/:id"><UpdateArticle/></AuthRoute>
              <AuthRoute path="/new"><NewArticle/></AuthRoute>
              <AuthRoute path="/categories"><Category/></AuthRoute>
              <AuthRoute path="/tags"><Tag/></AuthRoute>
              <AuthRoute path="/setting"><Setting/></AuthRoute>
              <AuthRoute path="/login"><Login/></AuthRoute>
              <AuthRoute path="/"><Index/></AuthRoute>
            </Switch>
          </BrowserRouter>
        </Auth>
      </Provider>
    );
  }

}
