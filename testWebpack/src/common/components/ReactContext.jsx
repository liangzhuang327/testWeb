import React, { Component } from 'react';

// defaultValue可以为空不传，传值是保证父级组建中没有调用Provider组建的时候，但是在子级组建中调用Consumer的时候，保证context中的值为defualtValue
// ⚠️ 如果父级组建调用了Provider组建，但是没有传value属性，在子级组建中调用Consumer的时候，context中的值不会是defaultValue⚠️，而是undefined
const ReactContext = React.createContext({background: '#222222',});

export default class Father extends Component{
    constructor(props){
        super(props)
    }

    computeState = () => {
        return {
            name: 'context'
        }
    }

    render(){
        let value = this.computeState()
        return(
            <ReactContext.Provider value={value}>
                <div>这里是Father组建</div>
                <Children />
            </ReactContext.Provider>
        )
    }
}

class Children extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return<div>
            这里是Chldren组建
            <Son />
        </div>
    }
}
class Son extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <ReactContext.Consumer>
                {(value)=>{
                    return <div>这里是Son组建<span>{`这里是从father拿到的context${JSON.stringify(value)}===>${value.name}`}</span></div>
                }}
            </ReactContext.Consumer>
        )
    }
}
