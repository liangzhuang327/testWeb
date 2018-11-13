import React, { Component } from 'react';
const img_url = require("../../image/man.png")
export default class WebpackPicture extends Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <div>
                <div className="test_img">https! picture ✅跨域</div>
                <div className="test_img_cross-origin-true">https! picture 不允许跨域</div>
                <div className="test_img_http">http! picture 与项目host相同</div>
                <div className="test_img_local">local picture 样式css里引入的图片</div>
                {/* svg图 现在loader没解呢 */}
                <img src="../../image/baidu.svg" />
                {/* img标签引入的图片 */}
                <img src={require("../../image/retou.png")} />
                <div style={{background: `url(${img_url})`, width:300, height:180}}> style内连样式引入的图片</div>
                <div>--👆------------------------------------------------------------------------------------------👆——————</div>
            </div>
        )
    }
}