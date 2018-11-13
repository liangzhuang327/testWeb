import React, { Component } from 'react';

export default class DefinePlugin extends Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <div>
                <span>DefinePlugin在运行环境中生命的变量：</span>
                <ul>
                    <li>__VERSION__:<span>{__VERSION__}</span></li>
                    <li>__DEVELOPER__:<span>{__DEVELOPER__}</span></li>
                </ul>
                <div>--👆------------------------------------------------------------------------------------------👆——————</div>
            </div>
        )
    }
}