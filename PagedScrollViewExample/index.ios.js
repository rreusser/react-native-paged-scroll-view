'use strict';

var React = require('react-native');

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  SwitchIOS,
  TouchableOpacity,
} = React;

import Device from './device'
import AddPaging from 'react-native-paged-scroll-view'
var PagedScrollView = AddPaging(ScrollView)
const slideColors = ['#678', '#786', '#867']

var PagedScrollViewExample = React.createClass({
  getInitialState: function () {
    return {
      horizontal: true
    }
  },

  handlePageChange: function (state) {
    this.setState(state)
  },

  slideStyles: function (i) {
    return {
      width: Device.width,
      height: Device.height,
      backgroundColor: slideColors[i % slideColors.length],
    }
  },

  renderSlide: function(x, i) {
    return (
      <View key={`slide-${i}`} style={this.slideStyles(i)}></View>
    )
  },

  renderPagination () {
    return (
      <View style={styles.pagination}>
        <View style={styles.field}>
          <Text style={styles.paginationText}>Horizontal: {this.state.currentHorizontalPage} / {this.state.totalHorizontalPages}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.paginationText}>Vertical: {this.state.currentVerticalPage} / {this.state.totalVerticalPages}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.paginationText}>Horizontal?</Text>
          <SwitchIOS
          style={{alignSelf: 'flex-end'}}
            onValueChange={(value) => this.setState({horizontal: value})}
            value={this.state.horizontal}
          />
        </View>
        <View style={styles.field}>
          <TouchableOpacity onPress={() => {this._scrollView.scrollToPage(
            this.state.currentHorizontalPage - (this.state.horizontal ? 1 : 0),
            this.state.currentVerticalPage - (this.state.horizontal ? 0 : 1)
          )}}>
            <Text style={styles.paginationText}>Prev  </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {this._scrollView.scrollToPage(
            this.state.currentHorizontalPage + (this.state.horizontal ? 1 : 0),
            this.state.currentVerticalPage + (this.state.horizontal ? 0 : 1)
          )}}>
            <Text style={styles.paginationText}>  Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  },

  renderDirectionSwitch () {
  },

  render: function () {
    return (
      <View style={styles.container}>
        <PagedScrollView
          ref={(c) => {this._scrollView = c}}
          horizontal={this.state.horizontal}
          pagingEnabled={true}
          onPageChange={this.handlePageChange}
        >
          {new Array(10).fill(0).map(this.renderSlide)}
        </PagedScrollView>
        {this.renderPagination()}
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pagination: {
    position: 'absolute',
    paddingHorizontal: 70,
    left: 0,
    bottom: 15,
    width: Device.width,
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  paginationText: {
    fontSize: 20,
    alignSelf: 'center',
    flex: 1,
  },
  field: {
    height: 35,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

AppRegistry.registerComponent('PagedScrollViewExample', () => PagedScrollViewExample);
