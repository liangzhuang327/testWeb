import React, { Component } from 'react';
import SimulateContext from './SimulateContext'

const SimulateConnect = function(mapStateToProps, mapDispatchToProps, ownProps){
    
    return function(WrapComponent){
        /** mapStateToProps, mapDispatchToProps为自己简化校验*/
        mapStateToProps || (mapStateToProps=()=>{return {}})
        mapDispatchToProps || (mapDispatchToProps=()=>{return {}})
        ownProps || {}
        let Consumer = SimulateContext.Consumer;
    
    
        class FinalExportHoc  extends Component{
            constructor(props){
                super(props)
            }
            render(){
                return <Consumer>
                            {ProviderValue => {
                                let finalProps = Object.assign({}, mapStateToProps(ProviderValue.store), mapDispatchToProps(ProviderValue.dispatch), ownProps);
                                return <WrapComponent {...finalProps}></WrapComponent>
                            }}
                        </Consumer>
            }
        }

        /**
         * 此处return注意，因为connect最终要返回的是一个包装过的组建，故最终导出的是一个类
         * 易错：
         * return(<div></div>)这种会报错:Did you accidentally export a JSX literal instead of a component?
         * 意思是connect最终导出的是一个JSX结构，并非一个组建
         */
        return(
            FinalExportHoc
        )
    } 
}
export default SimulateConnect



