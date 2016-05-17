'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};var _jsxFileName='src/PagedScrollView.js';var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value" in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();

var _react=require('react');var _react2=_interopRequireDefault(_react);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}

// Polyfill for Number.isNaN on Safari
// see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN
Number.isNaN=Number.isNaN||function(value){
return typeof value==='number'&&isNaN(value);};


function isPresent(datum){
return datum!==undefined&&!Number.isNaN(datum);}


var AddPaging=function AddPaging(ComposedComponent,scrollViewRefPropName){
var ComposedClass=function(_Component){_inherits(ComposedClass,_Component);
function ComposedClass(props){_classCallCheck(this,ComposedClass);var _this=_possibleConstructorReturn(this,Object.getPrototypeOf(ComposedClass).call(this,
props));

_this.refProp={};
_this.refProp[scrollViewRefPropName||'ref']=_this.getScrollViewRef.bind(_this);

// Important to remember these, but they're not really 'state' variables:
_this.scrollX=0;
_this.scrollY=0;
_this.initialized=false;

// We'll consider these state variables although maybe we shouldn't:
_this.state={
totalHorizontalPages:0,
totalVerticalPages:0,
currentHorizontalPage:null,
currentVerticalPage:null};return _this;}_createClass(ComposedClass,[{key:'componentWillUpdate',value:function componentWillUpdate(



nextProps,nextState){
if(this.props.onPageChange){
var sendEvent=false;
for(var key in nextState){
if(nextState.hasOwnProperty(key)){
var a=this.state[key];
var b=nextState[key];
if(a!==b&&!Number.isNaN(b)){
sendEvent=true;}}}



if(sendEvent){
this.props.onPageChange(nextState);}}}},{key:'_initialize',value:function _initialize()




{
if(this.initialized)return;
if(isPresent(this.state.totalHorizontalPages)&&
isPresent(this.state.totalVerticalPages)&&
isPresent(this.state.currentHorizontalPage)&&
isPresent(this.state.currentVerticalPage)){
this.initialized=true;
this.props.onInitialization&&this.props.onInitialization(this);}}},{key:'_handleScroll',value:function _handleScroll(



event){
// Still trigger the passed callback, if provided:
this.props.onScroll&&this.props.onScroll(event);

var e=event.nativeEvent;

// Get values from event:
this.scrollViewWidth=e.layoutMeasurement.width;
this.scrollViewHeight=e.layoutMeasurement.height;
this.innerScrollViewWidth=e.contentSize.width;
this.innerScrollViewHeight=e.contentSize.height;

// These are important, but they're not state variables that trigger an update:
this.scrollX=e.contentOffset.x;
this.scrollY=e.contentOffset.y;

var totalHorizontalPages=Math.floor(this.innerScrollViewWidth/this.scrollViewWidth+0.5);
var totalVerticalPages=Math.floor(this.innerScrollViewHeight/this.scrollViewHeight+0.5);

this.setState({
totalHorizontalPages:totalHorizontalPages,
totalVerticalPages:totalVerticalPages,
currentHorizontalPage:Math.min(Math.max(Math.floor(this.scrollX/this.scrollViewWidth+0.5)+1,0),totalHorizontalPages),
currentVerticalPage:Math.min(Math.max(Math.floor(this.scrollY/this.scrollViewHeight+0.5)+1,0),totalVerticalPages)});}},{key:'_measureScrollView',value:function _measureScrollView(



cb){var _this2=this;
var responder=this.getScrollResponder();
if(!responder){
return;}

responder.refs.ScrollView.measure(function(x,y,w,h){
_this2.scrollViewWidth=w;
_this2.scrollViewHeight=h;
cb&&cb();});}},{key:'_measureInnerScrollView',value:function _measureInnerScrollView(



cb){var _this3=this;
var responder=this.getScrollResponder();
if(!responder){
return;}

responder.refs.InnerScrollView.measure(function(x,y,w,h){
_this3.innerScrollViewWidth=w;
_this3.innerScrollViewHeight=h;
cb&&cb();});}},{key:'_handleContentSizeChange',value:function _handleContentSizeChange(



width,height){
this.props.onContentSizeChange&&this.props.onContentSizeChange(width,height);

// Get values from event:
this.innerScrollViewWidth=width;
this.innerScrollViewHeight=height;

var totalHorizontalPages=Math.max(1,Math.floor(this.innerScrollViewWidth/this.scrollViewWidth+0.5));
var totalVerticalPages=Math.max(1,Math.floor(this.innerScrollViewHeight/this.scrollViewHeight+0.5));

this.setState({
totalHorizontalPages:totalHorizontalPages,
totalVerticalPages:totalVerticalPages,
currentHorizontalPage:Math.min(Math.max(Math.floor(this.scrollX/this.scrollViewWidth+0.5)+1,0),totalHorizontalPages),
currentVerticalPage:Math.min(Math.max(Math.floor(this.scrollY/this.scrollViewHeight+0.5)+1,0),totalVerticalPages)});


this._initialize();}},{key:'render',value:function render()


{
return (
_react2.default.createElement(ComposedComponent,_extends({
scrollEventThrottle:this.props.scrollEventThrottle||16},
this.props,
this.refProp,{
onScroll:this._handleScroll.bind(this),
onContentSizeChange:this._handleContentSizeChange.bind(this),__source:{fileName:_jsxFileName,lineNumber:139}}),

this.props.children));}},{key:'scrollToPage',value:function scrollToPage(




horizontalPage,verticalPage,animated){
if(this._scrollView){
this._scrollView.scrollTo({
x:(Math.min(this.state.totalHorizontalPages,Math.max(1,horizontalPage))-1)*this.scrollViewWidth,
y:(Math.min(this.state.totalVerticalPages,Math.max(1,verticalPage))-1)*this.scrollViewHeight,
animated:animated});}}},{key:'componentDidMount',value:function componentDidMount()




{var _this4=this;
setTimeout(function(){
var succeededCbs=0;
var totalCbs=2;

var computeNewState=function computeNewState(){
if(++succeededCbs<totalCbs){
return;}


var totalHorizontalPages=Math.max(1,Math.floor(_this4.innerScrollViewWidth/_this4.scrollViewWidth+0.5));
var totalVerticalPages=Math.max(1,Math.floor(_this4.innerScrollViewHeight/_this4.scrollViewHeight+0.5));

_this4.setState({
totalHorizontalPages:totalHorizontalPages,
totalVerticalPages:totalVerticalPages,
currentHorizontalPage:Math.min(Math.max(Math.floor(_this4.scrollX/_this4.scrollViewWidth+0.5)+1,0),totalHorizontalPages),
currentVerticalPage:Math.min(Math.max(Math.floor(_this4.scrollY/_this4.scrollViewHeight+0.5)+1,0),totalVerticalPages)});


_this4._initialize();};


// Trigger both measurements at the same time and compute the new state only
// once they've both returned.
_this4._measureInnerScrollView(computeNewState);
_this4._measureScrollView(computeNewState);});}},{key:'getScrollViewRef',value:function getScrollViewRef(



c){
this._scrollView=c;}},{key:'getScrollResponder',value:function getScrollResponder()


{
return this._scrollView.getScrollResponder();}},{key:'getInnerViewNode',value:function getInnerViewNode()


{
return this.getScrollResponder().getInnerViewNode();}},{key:'setNativeProps',value:function setNativeProps(


props){
this._scrollView.setNativeProps(props);}}]);return ComposedClass;}(_react.Component);



ComposedClass.propTypes={
onInitialization:_react2.default.PropTypes.func,
onScroll:_react2.default.PropTypes.func,
onPageChange:_react2.default.PropTypes.func,
onContentSizeChange:_react2.default.PropTypes.func,
children:_react2.default.PropTypes.array,
scrollEventThrottle:_react2.default.PropTypes.number,
initialPage:_react2.default.PropTypes.number};


return ComposedClass;};exports.default=


AddPaging;