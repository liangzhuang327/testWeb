import SimulateContext from './SimulateContext';
import React, { Component } from 'react';

export default class SimulateProvider extends Component {
    constructor(props){
        super(props)
        // this.state={
        //     store: props.store,
        //     storeState: store.getState()
        // }
        this.state={
            store: {test: 'hello react-redux'}
        }
    }

    render(){
        /* Provider为react高阶API, 属性value */
        let Provider = SimulateContext.Provider;
        /* react组建中，props属性中会自带children属性，代表的是父组建下嵌套的所有自组建 */
        return (<div>
            <Provider value={this.state}>
                {/* 通过改变Provider包装者组建的state，触发最顶层组建state的变化
                    顶层组建重新刷新，嵌套的子组建也会准备重新render,全局所有子组建都会准备重新render */}
                <div onClick={()=>{this.setState({store: {test: 'fuck shit'}})}}>改变name</div>
                {this.props.children}
            </Provider>
        </div>)
    }
}