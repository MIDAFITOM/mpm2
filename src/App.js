import React, { Component } from 'react';
import {
    Image
} from "antd-mobile";
import './App.css';
import Mpm from "./component/mpm";
import Staking from "./component/staking";
import Dao from "./component/dao";
import seropp from 'sero-pp';

const dapp = {
    name: "MIDAFI",
    contractAddress: "5uVhXNsdN8TQdZTSeLeCAvCqqBeY6j5E7JrGtcEmf9hAoR1WEY91UriaKGcf1usAtJ32cfvQHG9qVsWt6xDHXULQ",
    github: "https://gitee.com/midafitom/mpm",
    author: "midafi",
    url: document.location.href,
    logo: 'https://midafitom.gitee.io/mpm/logo.png',
}

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            route: 0
        }
        this.tz = this.tz.bind(this);
        seropp.init(dapp, rest => {
            // console.log("[Staking] seropp init result >>> ", rest);
            if (rest === 'success') {
                console.log("seropp init success");
            } else {
                console.log("seropp init failed!");
            }
        })
    }
    tz() {
        this.setState({ route: 1 });
    }
    onStaking() {
        this.setState({ route: 2 });
    }
    onDAO() {
        this.setState({ route: 3 });
    }
    componentDidMount() {
        const params = new URLSearchParams(window.location.search)
        if (params.get('route') === '2') {
            this.setState({
                route: 3,
            });
        }
    }

    render() {
        var login = (
            <div className='login' >
                <Image src='./images/LOGO.png' fit='contain'></Image>
                <div className='login_div' onClick={this.tz}>
                    <img style={{ maxWidth: '70%', maxHeight: '40%' }} src={require('./img/mining.png')} alt="Promote Mining" />
                </div>
                <div className='login_div' onClick={() => this.onDAO()}>
                    <img style={{ maxWidth: '50%', maxHeight: '30%' }} src={require('./img/dao.png')} alt="Midafi DAO" />
                </div>
                <div className='login_div' onClick={() => this.onStaking()}>
                    <img style={{ maxWidth: '70%', maxHeight: '40%' }} src={require('./img/staking.png')} alt="Midafi Staking" />
                </div>
            </div>
        )
        var index = <Mpm />
        let staking = <Staking />
        let dao = <Dao />

        let show = () => {
            if (this.state.route === 0) {
                return login;
            } else if (this.state.route === 1) {
                return index;
            } else if (this.state.route === 2) {
                return staking;
            } else if (this.state.route === 3) {
                return dao;
            }
        }
        return (
            <div style={{ mixHeight: document.documentElement.clientHeight }} >
                {show()}
            </div>
        );
    }
}

export default App;
