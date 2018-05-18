import React, { Component } from 'react';

import { Link } from 'react-router'

import './Footer.less'



class Footer extends Component {

    constructor(props){
        super(props);
        this.state = {

        }
    }


    render(){
        return(
            <header className="footer">

                <hr style={{color:"#cccccc"}}/>

                <div className="footer-logo">
                    <img src={require("../../resource/img/agreement.png")} />
                    <span>星链协议签署平台</span>
                </div>

                <div className="footer-links">
                    <Link to={"/about"}> 使用说明 </Link>
                    <a href={'https://github.com/aircloud'} target={'_blank'}> 开发者介绍 </a>
                    <a href={'https://nebulas.io/'} target={'_blank'}> NEBULAS </a>
                </div>

            </header>
        )
    }
}

export default Footer