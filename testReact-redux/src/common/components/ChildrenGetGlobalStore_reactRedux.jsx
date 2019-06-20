import React, { Component } from 'react';
import SimulateConnect from '../../sourceCode/SimulateConnect';
console.log(SimulateConnect)
console.log(typeof SimulateConnect)
console.log(SimulateConnect())
console.log(typeof SimulateConnect())
console.log(SimulateConnect()(<div></div>))
console.log(typeof SimulateConnect()(<div></div>))
class ChildrenGetGlobalStore_reactRedux extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return (
            <div>
                <span>经过模拟的Connect组建包装的组建==>获取store的状态</span>
                <div>testName: {this.props.test}</div>
            </div>
        )
    }
}

function mapStateToProps(state){
    return{
        test: state.test
    }
}
function mapDispatchToProps(){
    return {}
}

export default SimulateConnect(mapStateToProps,mapDispatchToProps)(ChildrenGetGlobalStore_reactRedux)