import React, { Component } from 'react';
import ChildrenGetGlobalStore from '../components/ChildrenGetGlobalStore'
import ChildrenGetGlobalStore_reactRedux from '../components/ChildrenGetGlobalStore_reactRedux';

console.log(ChildrenGetGlobalStore)
console.log(<ChildrenGetGlobalStore />)
export default class TestWebpack extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <div>
                <ChildrenGetGlobalStore />
                <div>👆--------------------👆--------------------👆--------------------👆--------------------</div>
                <ChildrenGetGlobalStore_reactRedux />
                <div>👆--------------------👆--------------------👆--------------------👆--------------------</div>
            </div>
        )
    }
}