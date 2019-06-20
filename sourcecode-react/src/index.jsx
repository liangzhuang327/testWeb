import React, { Component } from 'react'
import ReactDom from 'react-dom'
import Test from './view/Test'

class App extends Component{
    render(){
        return (
            <div>
                <div>顶层组建</div>
                <Test />
            </div>
        )
    }
}

ReactDom.render(<App />, document.getElementById('container'))
if (module.hot){
    module.hot.accept()
}