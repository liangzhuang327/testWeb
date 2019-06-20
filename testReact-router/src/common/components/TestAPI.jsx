import React, { Component } from 'react';
import * as ReactRouterAPI from 'react-router';
import * as ReactRouterDomAPI from 'react-router-dom';

export default class TestAPI extends Component{
    constructor(props){
        super(props)
    }

    loop = (target, type) => {
        let arr = [];
        for(let i in target){
            if(target.hasOwnProperty(i)){
                arr.push(<div>{`${type}属性${i}，类型${typeof target[i]};`}</div>)
            }
        }
        return arr
    }

    render(){
        let ReactRouterAPI_attr = this.loop(ReactRouterAPI, 'ReactRouterAPI');
        let ReactRouterDomAPI_attr = this.loop(ReactRouterDomAPI, 'ReactRouterDomAPI');
        return(
            <div>
                <div>
                    ReactRouterAPI
                    <span>
                        {ReactRouterAPI_attr}
                    </span>
                </div>
                <div>ReactRouterDomAPI<span>{ReactRouterDomAPI_attr}</span></div>
                <div>--👆------------------------------------------------------------------------------------------👆——————</div>
            </div>
        )
    }
}