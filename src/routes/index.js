import React, { Component } from "react"
import { Router, Route, hashHistory, IndexRedirect } from "react-router"

import App from "../container/App"

import Main from "../pages/main/Main"

import About from "../pages/articles/About"
import JoinAndFund from "../pages/articles/JoinAndFund"
import Responsibility from "../pages/articles/Responsibility"
import RoadMap from "../pages/articles/RoadMap"

export default class CRouter extends Component {
    render() {
        return (
            <Router history={hashHistory}>
                <Route path="/" component={App}>
                    <IndexRedirect to="/main" />
                    <Route path="main" component={Main} />
                    <Route path="about" component={About} />
                    <Route path="joinandfund" components={JoinAndFund} />
                    <Route path="responsibility" components={Responsibility} />
                    <Route path="roadmap" components={RoadMap} />
                </Route>
            </Router>
        )
    }
}
