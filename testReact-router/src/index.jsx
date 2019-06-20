import React, {Component} from 'react';
import ReactDOM from 'react-dom'
import TestReactRouter from './common/client/index'

import './style/index.css'
import './style/test.less'

class App extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <div>
                <TestReactRouter />
            </div>
        )
    }
}
ReactDOM.render(<App />, document.getElementById('container'))
if (module.hot){
    module.hot.accept()
}
