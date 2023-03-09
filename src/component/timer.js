import React, {Component} from 'react';


class Timer extends Component {
    constructor(props) {
        super(props);
        this.delayTime = this.props.delayTime;
        this.state = {
            hour: "00",
            minute: "00",
            second: "00",
        }


    }

    componentDidMount() {
        this.startCountDown();
    }

    componentDidUpdate() {
        if (this.props.time !== this.delayTime) {
            this.delayTime = this.props.delayTime;

            this.clearTimer();
            this.startCountDown();
        }
    }

    clearTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    // 开启计时
    startCountDown() {
        if (this.delayTime && !this.timer) {
            this.timer = setInterval(() => {
                this.doCount();
            }, 1000);
        }
    }

    leftZero(d) {
        if (d < 10) {
            return "0" + d;
        } else {
            return "" + d;
        }
    }

    doCount() {
        const {onTimeout,} = this.props;
        const timeDiffSecond = this.delayTime - new Date().getTime() / 1000;

        if (timeDiffSecond <= 0) {
            this.clearTimer();
            if (typeof onTimeout === 'function') {
                onTimeout();
            }
            return;
        }

        const hour = Math.floor((timeDiffSecond % 86400) / 3600);
        const minute = Math.floor((timeDiffSecond % 3600) / 60);
        const second = Math.floor((timeDiffSecond % 3600) % 60);


        this.setState({
            hour: hour,
            minute: minute,
            second: second,
        });
    }

    render() {

        return (
            <div style={{maxHeight:'60px'}}>

                <div className="clock">

                </div>
            </div>

        );
    }
}

export default Timer;