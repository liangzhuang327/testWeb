
import 'babel-polyfill'
import route from '../route/index.jsx';
import React from 'react'
import ReactDOM from 'react-dom';
import '../css/test.css';
let pathName = window.location.pathname;
debugger
let dom = <div>您访问的路由暂无此页面</div>
let Dom
const renderDom = (dom) => {
    if (!dom) return
    let container = document.getElementById('container')
    ReactDOM.render(dom, container)
}

if (pathName == '/db'){
    let Node = route['db']
    Dom = <Node />
}
if (pathName == '/intersection'){
    let Node = route['intersectionObserver']
    Dom = <Node />
}
renderDom(Dom)