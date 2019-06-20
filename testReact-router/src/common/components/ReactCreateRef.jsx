import React, { Component } from 'react'


// 传说中的HOC(高阶组建)
/**
 *对需要包裹（enhanced增强功能）的基础组建 进行二次封装，实现某些公共的功能，比如打印props；
 *原则是不影响基础组建本身，只是进行扩展
 **/
const logProps = (WarppedComponent) => {
    class LogProps extends Component{
        componentWillReceiveProps(nextProps){
            console.log('preve props is : ', this.props);
            console.log('next props is : ', nextProps)
        }
        render(){
            return <WarppedComponent {...this.props} />
        }
    }
    return LogProps
}

class TestHOC extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return<div>测试高阶组建=======> 基础组建==继承顶层props的数量为：<span>{this.props.count}</span></div>
    }
}

// 高阶组建，即enhanced不要放到render里去包裹！！！！
let LogTestHOC = logProps(TestHOC);
export class TestLogHOC extends Component{
    constructor(props){
        super(props)
        this.state={
            count: 1
        }
    }
    render(){
        return (
            <div>
                <button onClick={()=>this.click()}>改变</button>
                <LogTestHOC count={this.state.count} />
            </div>
        )
    }
    click = () => {
        this.setState({count: this.state.count+1})
    }
}

/**
 * logProps高阶组建，无论传入的基础组建是谁，都会打印props的变化，达到了我们对HOC封装的目的
 * 
 * ！！问题来了：假如我的logProps还封装进了，对基础组建中的input自动聚焦的功能，怎么实现？
 * 
 * this.ref.focus==> 然而写在logProps里的ref只能标识HOC本身，即LogTestHOC，而不能标记
 * 到基础组建里的input上，这就是ref转发引用上场了
 */

 /**
  * 如何使用引用传递：
  * 1、引用传递React.createRef()，创建一个ref赋值给顶层组建
  * 2、React.forwardRef(function(props, ref)=>{返回一个组建})，用来绑定顶层组建穿过来的ref
  * 3、ref从顶层传到基础组建用的是定义一个props属性props[forwardRef]来存储顶层的ref，用props来传递的
  */

 const inputOutoFocus = (WarppedComponent) => {
    class InputOutoFocus extends Component{
        constructor(props){
            super(props)
        }
        render(){
            let { forwardRef, ...rest } = this.props
            return <WarppedComponent ref={forwardRef} {...rest} />
        }
    }
    return React.forwardRef((props, ref)=>{
        return <InputOutoFocus forwardRef={ref} {...props} />
    })
 }

 class TestRef extends Component{
     render(){
         return<input ref='input' placeholder='自动聚焦HOC'></input>
     }
 }

 const InputOutoFocusHOC =  inputOutoFocus(TestRef);

 export class TestRefHOC extends Component{
    constructor(props){
        super(props)
        this.ref = React.createRef();
    }
    componentDidMount(){
        // 创建的ref的current属性就是wrappedComponent
        // 即React.createRef().current 就是TestRef组建
        this.ref.current.refs.input.focus()
    }
    render(){
        return <InputOutoFocusHOC forwardRef={this.ref} />
    }
 }