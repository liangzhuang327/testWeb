import React, { Component } from 'react'

export default class Test extends Component{
    constructor(props){
        super(props)
        this.state = {
            count: 1
        }
    }

    render(){
        return (
            <div className="classTest">
                <button onClick={()=>this.onClick()}>增加</button>
                <div>数量：{this.state.count}</div>
            </div>
        )
    }

    onClick(){
        this.setState({
            count: this.state.count + 1
        })
    }
}