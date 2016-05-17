'use strict';

import React, { Component } from 'react';

// Polyfill for Number.isNaN on Safari
// see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN
Number.isNaN = Number.isNaN || function (value) {
  return typeof value === 'number' && isNaN(value);
};

function isPresent (datum) {
  return datum !== undefined && !Number.isNaN(datum);
}

var AddPaging = (ComposedComponent, scrollViewRefPropName) => {
  var ComposedClass = class extends Component {
    constructor (props) {
      super(props);

      this.refProp = {};
      this.refProp[scrollViewRefPropName || 'ref'] = this.getScrollViewRef.bind(this);

      // Important to remember these, but they're not really 'state' variables:
      this.scrollX = 0;
      this.scrollY = 0;
      this.initialized = false;

      // We'll consider these state variables although maybe we shouldn't:
      this.state = {
        totalHorizontalPages: 0,
        totalVerticalPages: 0,
        currentHorizontalPage: null,
        currentVerticalPage: null
      };
    }

    componentWillUpdate (nextProps, nextState) {
      if (this.props.onPageChange) {
        var sendEvent = false;
        for (var key in nextState) {
          if (nextState.hasOwnProperty(key)) {
            var a = this.state[key];
            var b = nextState[key];
            if (a !== b && !Number.isNaN(b)) {
              sendEvent = true;
            }
          }
        }
        if (sendEvent) {
          this.props.onPageChange(nextState);
        }
      }
    }

    _initialize () {
      if (this.initialized) return;
      if (isPresent(this.state.totalHorizontalPages) &&
          isPresent(this.state.totalVerticalPages) &&
          isPresent(this.state.currentHorizontalPage) &&
          isPresent(this.state.currentVerticalPage)) {
        this.initialized = true;
        this.props.onInitialization && this.props.onInitialization(this);
      }
    }

    _handleScroll (event) {
      // Still trigger the passed callback, if provided:
      this.props.onScroll && this.props.onScroll(event);

      var e = event.nativeEvent;

      // Get values from event:
      this.scrollViewWidth = e.layoutMeasurement.width;
      this.scrollViewHeight = e.layoutMeasurement.height;
      this.innerScrollViewWidth = e.contentSize.width;
      this.innerScrollViewHeight = e.contentSize.height;

      // These are important, but they're not state variables that trigger an update:
      this.scrollX = e.contentOffset.x;
      this.scrollY = e.contentOffset.y;

      var totalHorizontalPages = Math.floor(this.innerScrollViewWidth / this.scrollViewWidth + 0.5);
      var totalVerticalPages = Math.floor(this.innerScrollViewHeight / this.scrollViewHeight + 0.5);

      this.setState({
        totalHorizontalPages: totalHorizontalPages,
        totalVerticalPages: totalVerticalPages,
        currentHorizontalPage: Math.min(Math.max(Math.floor(this.scrollX / this.scrollViewWidth + 0.5) + 1, 0), totalHorizontalPages),
        currentVerticalPage: Math.min(Math.max(Math.floor(this.scrollY / this.scrollViewHeight + 0.5) + 1, 0), totalVerticalPages)
      });
    }

    _measureScrollView (cb) {
      var responder = this.getScrollResponder();
      if (!responder) {
        return;
      }
      responder.refs.ScrollView.measure((x, y, w, h) => {
        this.scrollViewWidth = w;
        this.scrollViewHeight = h;
        cb && cb();
      });
    }

    _measureInnerScrollView (cb) {
      var responder = this.getScrollResponder();
      if (!responder) {
        return;
      }
      responder.refs.InnerScrollView.measure((x, y, w, h) => {
        this.innerScrollViewWidth = w;
        this.innerScrollViewHeight = h;
        cb && cb();
      });
    }

    _handleContentSizeChange (width, height) {
      this.props.onContentSizeChange && this.props.onContentSizeChange(width, height);

      // Get values from event:
      this.innerScrollViewWidth = width;
      this.innerScrollViewHeight = height;

      var totalHorizontalPages = Math.max(1, Math.floor(this.innerScrollViewWidth / this.scrollViewWidth + 0.5));
      var totalVerticalPages = Math.max(1, Math.floor(this.innerScrollViewHeight / this.scrollViewHeight + 0.5));

      this.setState({
        totalHorizontalPages: totalHorizontalPages,
        totalVerticalPages: totalVerticalPages,
        currentHorizontalPage: Math.min(Math.max(Math.floor(this.scrollX / this.scrollViewWidth + 0.5) + 1, 0), totalHorizontalPages),
        currentVerticalPage: Math.min(Math.max(Math.floor(this.scrollY / this.scrollViewHeight + 0.5) + 1, 0), totalVerticalPages)
      });

      this._initialize();
    }

    render () {
      return (
        <ComposedComponent
          scrollEventThrottle={this.props.scrollEventThrottle || 16}
          {...this.props}
          {...this.refProp}
          onScroll={this._handleScroll.bind(this)}
          onContentSizeChange={this._handleContentSizeChange.bind(this)}
        >
          {this.props.children}
        </ComposedComponent>
      );
    }

    scrollToPage (horizontalPage, verticalPage) {
      this._scrollToPage(horizontalPage, verticalPage, true);
    }

    scrollWithoutAnimationToPage (horizontalPage, verticalPage) {
      this._scrollToPage(horizontalPage, verticalPage, false);
    }

    _scrollToPage (horizontalPage, verticalPage, animated) {
      if (this._scrollView) {
        this._scrollView.scrollTo({
          x: (Math.min(this.state.totalHorizontalPages, Math.max(1, horizontalPage)) - 1) * this.scrollViewWidth,
          y: (Math.min(this.state.totalVerticalPages, Math.max(1, verticalPage)) - 1) * this.scrollViewHeight,
          animated: animated
        });
      }
    }

    componentDidMount () {
      setTimeout(() => {
        var succeededCbs = 0;
        var totalCbs = 2;

        var computeNewState = () => {
          if (++succeededCbs < totalCbs) {
            return;
          }

          var totalHorizontalPages = Math.max(1, Math.floor(this.innerScrollViewWidth / this.scrollViewWidth + 0.5));
          var totalVerticalPages = Math.max(1, Math.floor(this.innerScrollViewHeight / this.scrollViewHeight + 0.5));

          this.setState({
            totalHorizontalPages: totalHorizontalPages,
            totalVerticalPages: totalVerticalPages,
            currentHorizontalPage: Math.min(Math.max(Math.floor(this.scrollX / this.scrollViewWidth + 0.5) + 1, 0), totalHorizontalPages),
            currentVerticalPage: Math.min(Math.max(Math.floor(this.scrollY / this.scrollViewHeight + 0.5) + 1, 0), totalVerticalPages)
          });

          this._initialize();
        };

        // Trigger both measurements at the same time and compute the new state only
        // once they've both returned.
        this._measureInnerScrollView(computeNewState);
        this._measureScrollView(computeNewState);
      });
    }

    getScrollViewRef (c) {
      this._scrollView = c;
    }

    getScrollResponder () {
      return this._scrollView.getScrollResponder();
    }

    getInnerViewNode () {
      return this.getScrollResponder().getInnerViewNode();
    }

    setNativeProps (props) {
      this._scrollView.setNativeProps(props);
    }
  };

  ComposedClass.propTypes = {
    onInitialization: React.PropTypes.func,
    onScroll: React.PropTypes.func,
    onPageChange: React.PropTypes.func,
    onContentSizeChange: React.PropTypes.func,
    children: React.PropTypes.array,
    scrollEventThrottle: React.PropTypes.number,
    initialPage: React.PropTypes.number
  };

  return ComposedClass;
};

export default AddPaging;
