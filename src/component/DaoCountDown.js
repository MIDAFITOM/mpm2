import React, { Component } from 'react'

export default class DaoCountDown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            day: "0",
            hour: "00",
            minute: "00",
            second: "00",
        }
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.refresh(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    refresh() {
        let sys_second = this.props.endTime - new Date().getTime();
        if (sys_second > 0) {
            let day = Math.floor(sys_second / 1000 / 3600 / 24);
            let hour = Math.floor((sys_second / 1000 / 3600) % 24);
            let minute = Math.floor((sys_second / 1000 / 60) % 60);
            let second = Math.floor(sys_second / 1000 % 60);
            this.setState({
                day: day,
                hour: hour < 10 ? "0" + hour : hour,
                minute: minute < 10 ? "0" + minute : minute,
                second: second < 10 ? "0" + second : second
            })
        }
    }

    render() {
        return (
            <span style={{ whiteSpace: 'pre-wrap' }}>{this.state.hour}:{this.state.minute}:{this.state.second}    {this.state.day} {this.props.dayText}</span>
        )
    }
}