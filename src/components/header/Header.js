import React, { Component } from 'react';

import axios from 'axios'
import {preURL} from "../../config";

import {userLogin, userLogOut} from "../../redux/action";

import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import {hashHistory, Link} from 'react-router';

import './Header.less'

/**
 * Created by Xiaotao.Nie on 2018/5/12.
 * All right reserved
 * IF you have any question please email onlythen@yeah.net
 */

class Header extends Component {

    constructor(props){
        super(props)
    }

    componentDidMount() {
        // axios.post(preURL + "/iflogin", {}, {withCredentials: true}).then((responseText) => {
        //     console.log('iflogin:', responseText.data)
        //     if(responseText.data.login){
        //         this.props.userLogin(responseText.data.info)
        //     }
        // })
        let info = window.localStorage.getItem("user")
        if(info && info !== "undefined"){
            console.log("info:", info)
            this.props.userLogin(JSON.parse(info))
        }
    }

    componentWillReceiveProps(props) {
        console.log('props:', props)
    }

    render(){
        return(
            <header className="App-header" style={{backgroundImage: `url(${require('../../resource/img/back1.jpg')})`}}>
                <div className="App-Top-Bar">
                <div className="App-slider">
                    <Link to={'/main'} activeClassName={"active"}>主页</Link>
                    <Link to={'/about'} activeClassName={"active"}>使用说明</Link>
                </div>
                <h1 className="App-title">星链协议 | NasAgreement</h1>
                <p className="App-intro">
                    星链协议致力于在一定程度上取代传统合同，可以将双方协议内容与资产额度托管在区块链上，并通过一系列制约和有限可选的原则确保资产归属。
                </p>
                </div>
            </header>
        )
    }
}

const mapStateToProps = (state) => {
    const { userInfo } = state
    return { userInfo }
}
const mapDispatchToProps = dispatch => ({
    userLogin: bindActionCreators(userLogin, dispatch),
    userLogOut: bindActionCreators(userLogOut, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)