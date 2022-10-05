import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../redux/actions';

import Header from './Header';
import Landing from './Landing';
import Dashboard from './Dashboard';
import BlogNew from './blogs/BlogNew';
import BlogShow from './blogs/BlogShow';

class App extends Component {
  componentDidMount() {
    this.props.fetchUser();
  }

  render() {
    return (
      <div className="container">
        <Router>
          <div>
            <Header />
            <Routes>
              <Route path="/blogs/new" element={<BlogNew/>} />
              <Route exact path="/blogs/:_id" element={<BlogShow/>} />
              <Route path="/blogs" element={<Dashboard/>} />
              <Route path="/" element={<Landing/>} />
            </Routes>
          </div>
        </Router>
      </div>
    );
  }
}

export default connect(null, actions)(App);
