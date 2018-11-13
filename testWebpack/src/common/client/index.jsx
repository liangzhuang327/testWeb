import React, { Component } from 'react';
import DefinePlugin from '../components/DefinePlugin';
import WebpackCss from '../components/WebpackCss';
import WebpackPicture from '../components/WebpackPicture';

export default class TestWebpack extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <div>
                <WebpackCss />
                <WebpackPicture />
                <DefinePlugin />
            </div>
        )
    }
}