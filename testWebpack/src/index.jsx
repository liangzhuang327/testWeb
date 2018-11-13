import React, {Component} from 'react';
import ReactDOM from 'react-dom'
import TestWebpack from './common/client/index'

import './style/index.css'
import './style/test.less'
// import '../index.html'

class App extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <div>
                <TestWebpack />
            </div>
        )
    }
}
ReactDOM.render(<App />, document.getElementById('container'))
if (module.hot){
    module.hot.accept()
}
