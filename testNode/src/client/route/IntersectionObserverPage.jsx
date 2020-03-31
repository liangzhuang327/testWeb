import React, {Component} from 'react'

export default class IntersectionObserverPage extends Component {
    constructor(props){
        super(props)
        this.state={
            visible: "invisible"
        }
    }

    componentDidMount(){
        this.io = new IntersectionObserver((entries)=>{
            console.dir(entries)
            if (entries[0].intersectionRatio>0){
                this.setState({visible: 'visible'})
            }else if (entries[0].intersectionRatio ==1) {
                this.setState({visible: 'holeVisilbe  完全可见'})
            }
            else{
                this.setState({visible: 'invisible'})
            }
        }, {
            root: this.fatherNode, // 相对target观察的根结点
            rootMargin: '100px 0px', // 增加root上下边界100像素
            threshold: [0,0.1, 0.2] // 预设的intersectionRatio值的集合，达到预设值触发回调
        });
        this.io.observe(this.node)
    }

    componentWillMount(){
        // this.io.unobserve(this.node)
        this.io && this.io.disconnect()
    }

    render(){
        return <div className="intersection_container">
            <div className={`${this.state.visible === 'invisible' ? 'info invisibleShow' : "info visibleShow"}`}>{this.state.visible}</div>
            <div className="kong1"></div>
            {/* demo3 相对于最近一层父 做insectionObserver 交叉观察*/}
            <div ref={node => this.fatherNode = node} style={{height: 200, overflow: 'auto', border: '1px solid black'}}>
                <div ref={node => this.node = node} className="testBox"></div>
                <div style={{height: 500}}></div>
            </div>

            {/* demo2 目标元素父级有两层滚动元素*/}
            {/* <div style={{height: 200, overflow: 'auto', border: '1px solid black'}}>
                <div ref={node => this.node = node} className="testBox"></div>
                <div style={{height: 500}}></div>
            </div> */}

            {/* demo1 最简单*/}
            {/* <div ref={node => this.node = node} className="testBox"></div> */}
            <div className="kong2"></div>
        </div>
    }
}