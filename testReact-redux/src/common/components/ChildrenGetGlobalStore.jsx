/**
 * done: 
 * 1、Consumer组建中会把从Provider中的value接受过来，至此，react-redux核心将react和redux联系起来已经实现
 * 2、Provider中value变化，所有引用Consumer的组建都要重新刷新：数据驱动视图层改变 。已经通过Provider的setState来实现
 * todo: 
 * 1、所有需要store的组建，都需要嵌套在Consumer组建之下,怎么简化？
 * react-redux通过connect组建来包装了一下Consumer以及Consumer下的组建 ，在ChildrenGetGolbalStore_reactRedux中
 * 实现
 */
import React, { Component } from 'react';
import SimulateContext from '../../sourceCode/SimulateContext';

export default class ChildrenGetGlobalStore extends Component {
    constructor(props){
        super(props)
    }
    render(){
        let Consumer = SimulateContext.Consumer
        return(
            <Consumer>
                {ProviderValue=>{
                    return <div>
                        <span>取子Provider像子组建传递的value成功，value.store.test字段展现</span>{ProviderValue.store.test}
                    </div>
                }}
            </Consumer>
        )
    }
}