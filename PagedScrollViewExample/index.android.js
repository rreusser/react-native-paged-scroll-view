'use strict';

import React, { Component } from 'react';

import {
  AppRegistry
} from 'react-native';

import App from './app'

var PagedScrollViewExample = React.createClass({
  render () {
    return <App/>
  }
});

AppRegistry.registerComponent('PagedScrollViewExample', () => PagedScrollViewExample);
