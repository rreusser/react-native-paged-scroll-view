'use strict'

import React from 'react-native'

var AddPaging = ComposedComponent => class extends React.Component {

  constructor (props) {
    super(props)

    // Important to remember these, but they're not really 'state' variables:
    this.scrollX = 0
    this.scrollY = 0

    // We'll consider these state variables although maybe we shouldn't:
    this.state = {
      totalHorizontalPages: 0,
      totalVerticalPages: 0,
      currentHorizontalPage: null,
      currentVerticalPage: null,
    }
  }

  handleScroll (event) {
    // Still trigger the passed callback, if provided:
    this.props.onScroll && this.props.onScroll(event)

    var e = event.nativeEvent

    // Get values from event:
    this.scrollViewWidth = e.layoutMeasurement.width
    this.scrollViewHeight = e.layoutMeasurement.height
    this.innerScrollViewWidth = e.contentSize.width
    this.innerScrollViewHeight = e.contentSize.height

    // These are important, but they're not state variables that trigger an update:
    this.scrollX = e.contentOffset.x
    this.scrollY = e.contentOffset.y

    var totalHorizontalPages = Math.floor(this.innerScrollViewWidth / this.scrollViewWidth + 0.5)
    var totalVerticalPages   = Math.floor(this.innerScrollViewHeight / this.scrollViewHeight + 0.5)

    this.setState({
      totalHorizontalPages:  totalHorizontalPages,
      totalVerticalPages:    totalVerticalPages,
      currentHorizontalPage: Math.min(Math.max(Math.floor(this.scrollX / this.scrollViewWidth + 0.5) + 1, 0), totalHorizontalPages),
      currentVerticalPage:   Math.min(Math.max(Math.floor(this.scrollY / this.scrollViewHeight + 0.5) + 1, 0), totalVerticalPages)
    })
  }

  componentWillUpdate (nextProps, nextState) {
    if (this.props.onPageChange) {
      var sendEvent = false
      for (var key in nextState) {
        if (nextState.hasOwnProperty(key)) {
          var a = this.state[key]
          var b = nextState[key]
          if (a !== b && ! Number.isNaN(b)) {
            sendEvent = true
          }
        }
      }
      if (sendEvent) {
        this.props.onPageChange(nextState)
      }
    }
  }

  measureScrollView (cb) {
    if (!this._scrollView) return
    this._scrollView.refs.ScrollView.measure((x,y,w,h) => {
      this.scrollViewWidth = w
      this.scrollViewHeight = h
      cb && cb()
    })
  }

  measureInnerScrollView (cb) {
    if (!this._scrollView) return
    this._scrollView.refs.InnerScrollView.measure((x,y,w,h) => {
      this.innerScrollViewWidth = w
      this.innerScrollViewHeight = h
      cb && cb()
    })
  }

  scrollToPage (horizontalPage, verticalPage) {
    this._scrollView.scrollTo(
      (Math.min(this.state.totalVerticalPages, Math.max(1, verticalPage)) - 1) * this.scrollViewHeight,
      (Math.min(this.state.totalHorizontalPages, Math.max(1, horizontalPage)) - 1) * this.scrollViewWidth
    )
  }

  componentDidMount () {
    setTimeout(() => {
      var succeededCbs = 0
      var totalCbs = 2

      var computeNewState = () => {
        if (++succeededCbs < totalCbs) return
        var totalHorizontalPages = Math.floor(this.innerScrollViewWidth / this.scrollViewWidth + 0.5)
        var totalVerticalPages   = Math.floor(this.innerScrollViewHeight / this.scrollViewHeight + 0.5)

        this.setState({
          totalHorizontalPages:  totalHorizontalPages,
          totalVerticalPages:    totalVerticalPages,
          currentHorizontalPage: Math.min(Math.max(Math.floor(this.scrollX / this.scrollViewWidth + 0.5) + 1, 0), totalHorizontalPages),
          currentVerticalPage:   Math.min(Math.max(Math.floor(this.scrollY / this.scrollViewHeight + 0.5) + 1, 0), totalVerticalPages)
        })
      }

      // Trigger both measurements at the same time and compute the new state only
      // once they've both returned.
      this.measureInnerScrollView(computeNewState)
      this.measureScrollView(computeNewState)
    })
  }

  handleContentSizeChange (width, height) {
    this.props.onContentSizeChange && this.props.onContentSizeChange(width, height)

    // Get values from event:
    this.innerScrollViewWidth = width
    this.innerScrollViewHeight = height

    var totalHorizontalPages = Math.floor(this.innerScrollViewWidth / this.scrollViewWidth + 0.5)
    var totalVerticalPages   = Math.floor(this.innerScrollViewHeight / this.scrollViewHeight + 0.5)

    this.setState({
      totalHorizontalPages:  totalHorizontalPages,
      totalVerticalPages:    totalVerticalPages,
      currentHorizontalPage: Math.min(Math.max(Math.floor(this.scrollX / this.scrollViewWidth + 0.5) + 1, 0), totalHorizontalPages),
      currentVerticalPage:   Math.min(Math.max(Math.floor(this.scrollY / this.scrollViewHeight + 0.5) + 1, 0), totalVerticalPages)
    })
  }

  getInnerRef (c) {
    this.props.innerRef && this.props.innerRef(c)
    this._scrollView = c
  }

  render () {
    return (
      <ComposedComponent
        scrollEventThrottle={this.props.scrollEventThrottle || 16}
        {...this.props}
        ref={this.getInnerRef.bind(this)}
        onScroll={this.handleScroll.bind(this)}
        onContentSizeChange={this.handleContentSizeChange.bind(this)}
      >
        {this.props.children}
      </ComposedComponent>
    )
  }
}

export default AddPaging
