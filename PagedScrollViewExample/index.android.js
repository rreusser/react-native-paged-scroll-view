'use strict';

var React = require('react-native');

var {
  AppRegistry,
} = React;

import App from './app'

var PagedScrollViewExample = React.createClass({
  render () {
    return <App/>
  }
});

AppRegistry.registerComponent('PagedScrollViewExample', () => PagedScrollViewExample);
