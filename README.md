# react-native-paged-scroll-view

> A higher-order React Native component to compute the current and total pages of a ScrollView-compatible component

## Introduction

This module implements a [higher-order component](https://gist.github.com/sebmarkbage/ef0bf1f338a7182b6775) that computes the current and total pages contained in a React Native [ScrollView](https://facebook.github.io/react-native/docs/scrollview.html) (or functionally similar) component. So it's really very simple. Seriously, when you get down to it it's like a division and a floor function. But it attempts to solve layout race conditions, re-layout and other subtleties. This component could trivially be used as a swiper alongside a page indicator but does not implement that itself.

## Example

![PagedScrollViewExample](./example.gif)

```javascript
import { ScrollView } from 'react-native'
import AddPaging from 'react-native-paged-scroll-view'
var PagedScrollView = AddPaging(ScrollView)

  ...
  handlePageChange (state) {
    // Triggered on layout or when the page state changes:
    console.log('current horizontal page:', state.currentHorizontalPage)
    console.log('current vertical page:  ', state.currentVerticalPage)
    console.log('total horizontal pages: ', state.totalHorizontalPages)
    console.log('total vertical pages:   ', state.totalVerticalPages)
  }

  anotherMethod () {
    // Can also query imperatively via ref:
    this.refs.PagedScrollView.state.currentHorizontalPage
  }

  render () {
    return (
      <PagedScrollView
        ref="PagedScrollView"
        onPageChange={this.handlePageChange.bind(this)}
      >
        ...
      </PagedScrollView>
    )
  }
  ...
```

## Note on compatibility

It appears that [`onContentSizeChange`](http://facebook.github.io/react-native/docs/scrollview.html#oncontentsizechange) may be new as of RN 0.16. (See: [source](https://github.com/facebook/react-native/blob/38db6fa4658e8074a91f2c541bee3d00fe3ea50a/Libraries/Components/ScrollView/ScrollView.js#L368)) I believe it's just a convenience method, but I haven't implemented backwards-compatibility. Without this, the component won't automatically update if its content changes.

## Installation

```bash
$ npm install react-native-paged-scroll-view
```

## Usage

##### `require('react-native-paged-scroll-view')(Component, [scrollViewRefPropName="ref"])`
Wrap either a `ScrollView` or a component functionally equivalent (implements `onScroll` and similar basic methods). Returns a higher order component with props passed through.

**Arguments**:
- `Component`: The component being wrapped. It must implement the basic methods of a ScrollView.
- `scrollViewRefPropName`: the name of the property passed to `Component` that will return the ref. This exists in case you have a wrapped `ScrollView` component for which `ref` returns the ref to the wrapper instead of the ref to the `ScrollView`. If you provide this property, then your wrapped `ScrollView` should have a property `ref={this.props.<scrollViewRefPropName>} ` with your method name inserted. If you're just using a `ScrollView` though, you should be fine. Suggestions on how to improve this are welcome.

**Props**:
- `onPageChange`: `function(state)`: Executed on initial layout, when the page changes, or when the inner content changes. Callback is passed `state` object containing:
  - `totalHorizontalPages`: total number of horizontal pages, rounded to the nearest integer.
  - `totalVerticalPages`: total number of vertical pages, rounded to the nearest integer.
  - `currentHorizontalPage`: the current horizontal page, rounded to the nearest integer.
  - `currentVerticalPage`: the current vertical page, rounded to the nearest integer.
- `onInitialization`: `function(ref)`: Executed once, when the component is initially mounted and only once the dimensions have been measured. Useful, for example, for scrolling to a specific page once the component is mounted.

**Attributes**:
- `ref.scrollX`: current horizontal scroll offset
- `ref.scrollY`: current vertical scroll offset
- `ref.state.currentHorizontalPage`: as defined above
- `ref.state.currentVerticalPage`: as defined above
- `ref.state.totalHorizontalPages`: as defined above
- `ref.state.totalVerticalPages`: as defined above

**Methods**:
- `ref.scrollToPage(horizontal, vertical)`: Scroll to a specific page
- `ref.scrollWithoutAnimationToPage(horizontal, vertical)`: Jump immediately to a specific page


# License
(c) 2015 Ricky Reusser. MIT License.
