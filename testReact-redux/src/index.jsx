import React, {Component} from 'react';
import ReactDOM from 'react-dom'
import TestWebpack from './common/client/index'
import SimulateProvider from './sourceCode/SimulateProvider'

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
                <SimulateProvider>
                    <TestWebpack />
                </SimulateProvider>
            </div>
        )
    }
}
ReactDOM.render(<App />, document.getElementById('container'))
if (module.hot){
    module.hot.accept()
}
