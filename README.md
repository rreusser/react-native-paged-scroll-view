# react-native-paged-scroll-view

> A higher-order React Native component to compute the current and total pages of a ScrollView-compatible component

## Introduction

This module implements a [higher-order component](https://gist.github.com/sebmarkbage/ef0bf1f338a7182b6775) that computes the current and total pages contained in a React Native [ScrollView](https://facebook.github.io/react-native/docs/scrollview.html) (or functionally similar) component. So it's really very simple but attempts to solve layout race conditions, re-layout and other subtleties. This component could trivially be used as a swiper alongside a page indicator but does not implement that itself.

## Installation

```bash
$ npm install react-native-paged-scroll-view
```

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


## Usage

#### `require('react-native-paged-scroll-view')(Component)`
Wrap either a `ScrollView` or a component functionally equivalent (implements `onScroll` and similar basic methods). Returns a higher order component with props passed through.

**Props**:
- `onPageChange`: `function(state)`: Executed on initial layout, when the page changes, or when the inner content changes. Callback is passed `state` object containing:
  - `totalHorizontalPages`: total number of horizontal pages, rounded to the nearest integer.
  - `totalVerticalPages`: total number of vertical pages, rounded to the nearest integer.
  - `currentHorizontalPage`: the current horizontal page, rounded to the nearest integer.
  - `currentVerticalPage`: the current vertical page, rounded to the nearest integer.

**Attributes**:
The above props may be accesed on `ref.state.*` in addition to:
- `ref.scrollX`: current horizontal scroll offset
- `ref.scrollY`: current vertical scroll offset


# License
(c) 2015 Ricky Reusser. MIT License.
