import React, { Component } from 'react';
import TestAPI from '../components/TestAPI';

export default class TestReactRouter extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <div>
                <TestAPI />
            </div>
        )
    }
}