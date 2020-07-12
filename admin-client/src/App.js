import React from 'react';
import { Provider } from 'react-redux';
import configureStore from './store';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Auth from './Auth';
import Index from './pages/Index';
import Category from './pages/Category';
import Tag from './pages/Tag';
import NewArticle from './pages/NewArticle';
import UpdateArticle from './pages/UpdateArticle';
import Setting from './pages/Setting';

const store = configureStore();

export default class App extends React.Component {

  render() {
    return (
      <Provider store={store}>
        <Auth>
          <BrowserRouter basename="/admin">
            <Switch>
              <Route path="/article-edit/:id"><UpdateArticle/></Route>
              <Route path="/new"><NewArticle/></Route>
              <Route path="/categories"><Category/></Route>
              <Route path="/tags"><Tag/></Route>
              <Route path="/setting"><Setting/></Route>
              <Route path="/"><Index/></Route>
            </Switch>
          </BrowserRouter>
        </Auth>
      </Provider>
    );
  }

}
