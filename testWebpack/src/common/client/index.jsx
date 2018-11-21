import React, { Component } from 'react';
import DefinePlugin from '../components/DefinePlugin';
import WebpackCss from '../components/WebpackCss';
import WebpackPicture from '../components/WebpackPicture';
import ReactContext from '../components/ReactContext';
import {TestLogHOC, TestRefHOC} from '../components/ReactCreateRef'

export default class TestWebpack extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <div>
                {/* webpack测试 */}
                {/* <WebpackCss />
                <WebpackPicture />
                <DefinePlugin /> */}
                {/* react api 测试 */}
                <ReactContext />
                <TestLogHOC />
                <TestRefHOC />
            </div>
        )
    }
}