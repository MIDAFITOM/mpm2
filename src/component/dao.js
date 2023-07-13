import React, { Component } from 'react';
import copy from 'copy-to-clipboard';
import "./dao.css";
import {
    Button, Toast, List, Grid, Tag, AutoCenter, Divider,
    Image, Input, Popover, Modal,
    ConfigProvider, setDefaultConfig
} from "antd-mobile";
import DaoCountDown from "./DaoCountDown";
import CountTimeDown from "./countTimeDown";
import BigNumber from 'bignumber.js';
import zhHK from 'antd-mobile/es/locales/zh-HK'
import enUS from 'antd-mobile/es/locales/en-US';
import zh_HK from './dao_zh_HK';
import en_US from './dao_en_US';
import seropp from 'sero-pp';
import Web3 from 'sero-web3';
import { decimals, showAmount, showAddr, showPK, sameDay } from "./utils";
import vote, { voteBalance, voteAddr } from './vote';
import multiTrigger from './MultiTrigger';
import JSONBigNumber from 'json-bignumber';

const IMAGE_ROOT = './images/dao/';
const MIDAFI_CURRENCY = "MIDAFI";
const GITHUB = "https://github.com/MIDAFITOM/mpm";
const GITEE = "https://gitee.com/midafitom/mpm2";
const NETLIFY = 'https://midafi.netlify.app/';
const BURN_ADDR = "2WLb9KS5WrHDk1HxNNV1bKc3hY5KJ63Vq2vAgJNpQhHU2cXQB5eVNiCRSPYXc4toHBExkqGJTQsgWekFQbXqAzvE";
const MPM_ADDR = "5rSip4QXiri9rYjiJaP5FsGcYWXvHD8LLXXQRAGj3fkjMvhyYvHkzevi775UXYimuHpC2AYVz83dueCWH5yAHdu3";
let web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider("https://light.seronode.io/"))
let treasuryBalance = new BigNumber(0);
try {
    treasuryBalance = web3.sero.getBalance(BURN_ADDR, "latest");
} catch (error) {
    console.log("get latest treasury balance error: ", error);
}
let mpmBalance = new BigNumber(0);
try {
    mpmBalance = web3.sero.getBalance(MPM_ADDR, "latest");
} catch (error) {
    console.log("get latest mpm balance error: ", error);
}
let destroyedBalance = treasuryBalance?.tkn?.[MIDAFI_CURRENCY] || new BigNumber(0);
const TOTAL_SUPPLY = new BigNumber(21e23);
const RELEASE_DATE = new Date(2023, 0, 20, 12);
const days = Math.floor((Date.now() - RELEASE_DATE) / (1000 * 60 * 60 * 24));
let marketingBalance = mpmBalance?.tkn?.MIDAFI || new BigNumber(0);
marketingBalance = new BigNumber(marketingBalance.toString());

const stakingBalance = new BigNumber(1155e21).minus(new BigNumber(31.64e18).multipliedBy(days));
const fundBalance = new BigNumber(315e21).minus(new BigNumber(8.6e18).multipliedBy(days));
let circulation = TOTAL_SUPPLY.minus(marketingBalance).minus(stakingBalance).minus(fundBalance).minus(destroyedBalance);

class Dao extends Component {
    constructor(props) {
        super(props);
        setDefaultConfig({
            locale: zhHK,
        });
        this.state = {
            locale: zhHK,
            lang: zh_HK,
            accounts: [],
            account: {
                Name: "",
                PK: "",
                MainPKr: "",
                Balance: {
                    SERO: "0",
                    MIDAFI: "0",
                }
            },
            SERO: 0,
            MIDAFI: 0,
            voteBalance: voteBalance,

            allMyVotes: 0,
            myRewards: 0,
            myWinnerRewards: 0,
            myWinnerBonus: 0,

            nextAwardTime: 0,
            winnerVote0: 0,
            winnerElected0: "",
            winnerVote1: 0,
            winnerElected1: "",
            winnerVote2: 0,
            winnerElected2: "",
            winnerVote3: 0,
            winnerElected3: "",
            winnerVote4: 0,
            winnerElected4: "",
            winnerVote5: 0,
            winnerElected5: "",
            lastWinnerVotes: 0,
            lastWinnerElectedStr: "",

            inputVotes: '0',
            inputElected: "",

            voteStartTime: 0,
            voteEndTime: 0,
            currentVotes: 0,
        };
    }

    componentDidMount() {
        seropp.getAccountList(accounts => {
            this.setState({ accounts: accounts });
            for (var i = 0; i < accounts.length; i++) {
                if (!accounts[i].IsCurrent) {
                    continue;
                }
                this.setState({
                    account: accounts[i],
                    SERO: decimals(accounts[i].Balance.get("SERO"), 18, 2),
                    MIDAFI: decimals(accounts[i].Balance.get(MIDAFI_CURRENCY), 18, 2),
                });
                this.initAccount(this.state.accounts[i].MainPKr);
                this.initSystemInfo(this.state.accounts[i].MainPKr);
                let mainPKr = this.state.accounts[i].MainPKr;
                this.timerAccount = setInterval(
                    () => this.initAccount(mainPKr),
                    10 * 1000
                );
                this.timerSystem = setInterval(
                    () => this.initSystemInfo(mainPKr),
                    10 * 1000
                );
                break;
            }
        });
    }

    componentWillUnmount() {
        if (this.timerAccount) {
            clearInterval(this.timerAccount);
        }
        if (this.timerSystem) {
            clearInterval(this.timerSystem);
        }
    }

    changeLocale = (lang) => {
        if (lang === "zh_HK") {
            this.setState({ locale: zhHK, lang: zh_HK });
            setDefaultConfig({
                locale: zhHK,
            });
        } else {
            this.setState({ locale: enUS, lang: en_US });
            setDefaultConfig({
                locale: enUS,
            });
        }
    }

    changeAccount2() {
        let self = this;
        Modal.show({
            closeOnMaskClick: true,
            closeOnAction: true,
            disableBodyScroll: false,
            content:
                <List>
                    {self.state.accounts.map((account, index) => {
                        return <List.Item key={index} arrow={false} onClick={() => {
                            Modal.clear();
                            console.log("changed to wallet", account.Name, account.MainPKr);
                            self.setState({
                                account: account,
                                SERO: decimals(account.Balance.get("SERO"), 18, 2),
                                MIDAFI: decimals(account.Balance.get(MIDAFI_CURRENCY), 18, 2)
                            });
                            self.initAccount(account.MainPKr);
                            if (self.timerAccount) {
                                clearInterval(self.timerAccount);
                                self.timerAccount = null;
                            }
                            self.timerAccount = setInterval(
                                () => self.initAccount(account.MainPKr),
                                10 * 1000
                            );
                        }}>
                            {showPK(account.Name, account.MainPKr, 4)}
                        </List.Item>
                    })}
                </List>
        });
    }

    async initAccount(mainPKr) {
        multiTrigger.daoStatus(mainPKr, (json_) => {
            if (json_ === '0x0') {
                return;
            }
            const j = JSON.parse(json_);
            console.log('daoStatus:', j);
            let allMyVotes = new BigNumber(j.currentVotes).plus(j.pastVotes);
            this.setState({
                allMyVotes: decimals(allMyVotes, 18, 2),
                myRewards: decimals(j.voterRewards, 18, 2),
                myWinnerRewards: j.winnerRewards,
                myWinnerBonus: j.winnerBonus,
                updateTime: j.updateTime,
            });
        });
        vote.updateTimeOf(mainPKr, (res) => {
            console.log("updateTimeOf = ", res.toString());
        });
    }

    async initSystemInfo(mainPKr) {
        multiTrigger.daoInfo(mainPKr, (json_) => {
            if (json_ === '0x0') {
                return;
            }
            const j = JSONBigNumber.parse(json_);
            this.setState({
                nextAwardTime: j.nextAwardTime.toNumber(),
                voteStartTime: new Date(j.voteStartTime.toNumber() * 1000),
                voteEndTime: new Date(j.voteEndTime.toNumber() * 1000),
                lastWinnerVotes: decimals(j.lastWinnerVotes, 18, 2),
                lastWinnerElectedStr: j.lastWinnerElectedStr,

                winnerVote0: decimals(j.winners[0].votes, 18, 2),
                winnerElected0: j.winners[0].address,
                winnerVote1: decimals(j.winners[1].votes, 18, 2),
                winnerElected1: j.winners[1].address,
                winnerVote2: decimals(j.winners[2].votes, 18, 2),
                winnerElected2: j.winners[2].address,
                winnerVote3: decimals(j.winners[3].votes, 18, 2),
                winnerElected3: j.winners[3].address,
                winnerVote4: decimals(j.winners[4].votes, 18, 2),
                winnerElected4: j.winners[4].address,
                winnerVote5: decimals(j.winners[5].votes, 18, 2),
                winnerElected5: j.winners[5].address,
                currentVotes: decimals(j.currentVotes, 18, 2),
            });
        });
    }

    vote() {
        if (this.state.inputElected === '') {
            console.log("empty elected");
            return;
        }
        if (this.state.inputVotes === '0') {
            console.log("votes is 0");
            return;
        }
        if (!isValidPkr(this.state.inputElected)) {
            console.log("not valid address");
            return;
        }
        vote.vote(this.state.account.PK, this.state.account.MainPKr, this.state.inputElected, new BigNumber(this.state.inputVotes).multipliedBy(1e18));
    }

    revoke() {
        vote.revoke(this.state.account.PK, this.state.account.MainPKr);
    }

    withdrawVoterRewards() {
        vote.withdrawVoterRewards(this.state.account.PK, this.state.account.MainPKr);
    }

    withdrawWinnerRewards() {
        vote.withdrawWinnerRewards(this.state.account.PK, this.state.account.MainPKr);
    }

    trigger() {
        multiTrigger.trigger(this.state.account.PK, this.state.account.MainPKr);
    }

    withdrawDevRewards() {
        vote.withdrawDevRewards(this.state.account.PK, this.state.account.MainPKr, this.state.devRewards);
    }

    withdrawTechRewards() {
        vote.withdrawTechRewards(this.state.account.PK, this.state.account.MainPKr, this.state.techRewards);
    }

    copyWithFeedback(text) {
        copy(text);
        Toast.show({
            content: <span style={{ color: 'white' }}>{this.state.lang.tip.addrCopied}</span>
        });
    }

    render() {
        let imageLocation = IMAGE_ROOT + this.state.lang.imageLocation + '/';
        const now = new Date();
        let voteFlag = false;
        if (now >= this.state.voteStartTime && now < this.state.voteEndTime) {
            voteFlag = true;
        }
        let currentAccount = showPK(this.state.account.Name, this.state.account.MainPKr, 4);
        let exp = new Date().getTime() + 129600000 - (new Date().getHours() * 60 * 60 + new Date().getMinutes() * 60 + new Date().getSeconds()) * 1000;
        console.log("updateTime = ", this.state.updateTime);
        let cardAccount = () => {
            return (
                <List mode='card'
                    style={{
                        backgroundImage: `url(./images/dao/bg_01.png)`,
                        backgroundSize: '100% 100%',
                        padding: "0.5rem",
                        margin: '1rem',
                    }}>
                    <List.Item arrow={false} onClick={() => Modal.alert({
                        closeOnMaskClick: true,
                        showCloseButton: true,
                        title: this.state.lang.changeWallet.title,
                        content: this.state.lang.changeWallet.content,
                        confirmText: this.state.lang.changeWallet.ok,
                        onConfirm: () => this.changeAccount2(),
                    })}>
                        <Grid columns={12} gap={8} style={{ '--gap-vertical': '0.8rem' }}>
                            <Grid.Item span={3}>
                                <div className='dao-title'>{this.state.lang.button.wallet}</div>
                            </Grid.Item>
                            <Grid.Item span={7}>
                                <AutoCenter>
                                    <div className="dao-text">{currentAccount}</div>
                                </AutoCenter>
                            </Grid.Item>
                            <Grid.Item span={2}>
                                <AutoCenter>
                                    <Image src={imageLocation + 'button_switch.png'} fit='contain' width={50} />
                                </AutoCenter>
                            </Grid.Item>
                        </Grid>
                    </List.Item>
                    <List.Item>
                        <Grid columns={12} gap={8} style={{ '--gap-vertical': '0.8rem' }}>
                            <Grid.Item span={3} >
                                <div className="dao-title">MIDAFI</div>
                            </Grid.Item>
                            <Grid.Item span={7}>
                                <AutoCenter>
                                    <div className="dao-text">{this.state.MIDAFI}</div>
                                </AutoCenter>
                            </Grid.Item>
                            <Grid.Item span={2}></Grid.Item>
                            <Grid.Item span={3}>
                                <div className="dao-title">SERO</div>
                            </Grid.Item>
                            <Grid.Item span={7}>
                                <AutoCenter>
                                    <div className="dao-text">{this.state.SERO}</div>
                                </AutoCenter>
                            </Grid.Item>
                            <Grid.Item span={2}></Grid.Item>
                        </Grid>
                    </List.Item>
                </List >
            );
        }
        let cardWinner = () => {
            if (this.state.myWinnerRewards === 0 && this.state.myWinnerBonus === 0) {
                return (<></>);
            }
            return (
                <List mode='card'
                    style={{
                        backgroundImage: `url(./images/dao/bg_02.png)`,
                        backgroundSize: '100% 100%',
                        padding: "0.5rem",
                        margin: '1rem',
                    }}>
                    <List.Item>
                        <Grid columns={12} gap={8} style={{ '--gap-vertical': '0.8rem' }}>
                            <Grid.Item span={12}>
                                <AutoCenter><Image src={imageLocation + 'title_winner.png'} fit='contain' width={50}  ></Image></AutoCenter>
                            </Grid.Item>
                            <Grid.Item span={4}><div className="dao-title">{this.state.lang.button.winnerRewards}</div></Grid.Item>
                            <Grid.Item span={5}><div className='dao-text'>{decimals(this.state.myWinnerRewards, 18, 2)}</div></Grid.Item>
                            <Grid.Item span={3}><div className='dao-text'>MIDAFI</div></Grid.Item>
                            <Grid.Item span={4}></Grid.Item>
                            <Grid.Item span={5}><div className='dao-text'>{decimals(this.state.myWinnerBonus, 18, 2)}</div></Grid.Item>
                            <Grid.Item span={3}><div className='dao-text'>SERO</div></Grid.Item>
                            <Grid.Item span={12}>
                                <AutoCenter>
                                    <Image src={imageLocation + 'button_withdraw.png'} fit='contain' width={50} onClick={() => this.withdrawWinnerRewards()}></Image>
                                </AutoCenter>
                            </Grid.Item>
                        </Grid>
                    </List.Item>
                </List>
            );
        }
        let cardInfo = () => {
            return (
                <List mode='card'
                    style={{
                        backgroundImage: `url(./images/dao/bg_03.png)`,
                        backgroundSize: '100% 100%',
                        padding: "0.5rem",
                        margin: '1rem',
                    }}>
                    <List.Item>
                        <Grid columns={12} gap={8} style={{ '--gap-vertical': '0.8rem' }}>
                            <Grid.Item span={12}>
                                <AutoCenter><Image src='./images/dao/MIDAFI.png' fit='contain' height={'1.5em'} ></Image></AutoCenter>
                            </Grid.Item>
                            <Grid.Item span={4} >
                                <div className="dao-title">{this.state.lang.button.totalSupply}</div>
                            </Grid.Item>
                            <Grid.Item span={8}>
                                <div className="dao-text">{showAmount(TOTAL_SUPPLY, 18, 2)}</div>
                            </Grid.Item>
                            <Grid.Item span={4}>
                                <div className="dao-title">{this.state.lang.button.circulation}</div>
                            </Grid.Item>
                            <Grid.Item span={8}>
                                <div className="dao-text">{showAmount(circulation, 18, 2)}</div>
                            </Grid.Item>
                            <Grid.Item span={4}>
                                <div className="dao-title">{this.state.lang.button.marketingBalance}</div>
                            </Grid.Item>
                            <Grid.Item span={8}>
                                <div className="dao-text">{showAmount(marketingBalance, 18, 2)}</div>
                            </Grid.Item>
                            <Grid.Item span={4}>
                                <div className="dao-title">{this.state.lang.button.stakingBalance}</div>
                            </Grid.Item>
                            <Grid.Item span={8}>
                                <div className="dao-text">{showAmount(stakingBalance, 18, 2)}</div>
                            </Grid.Item>
                            <Grid.Item span={4}>
                                <div className="dao-title">{this.state.lang.button.fundBalance}</div>
                            </Grid.Item>
                            <Grid.Item span={8}>
                                <div className="dao-text">{showAmount(fundBalance, 18, 2)}</div>
                            </Grid.Item>
                            <Grid.Item span={4}>
                                <div className="dao-title">{this.state.lang.button.destroyedBalance}</div>
                            </Grid.Item>
                            <Grid.Item span={8}>
                                <div className="dao-text">{decimals(destroyedBalance, 18, 2)}</div>
                            </Grid.Item>
                        </Grid>
                    </List.Item>
                </List>
            )
        }
        let cardVote = () => {
            return (
                <List
                    mode='card'
                    style={{
                        backgroundImage: `url(./images/dao/bg_04.png)`,
                        backgroundSize: '100% 100%',
                        padding: "0.5rem",
                        margin: '1rem',
                    }}>
                    <List.Item>
                        <Grid columns={12} gap={8} style={{ '--gap-vertical': '0.8rem' }}>
                            <Grid.Item span={3} >
                            </Grid.Item>
                            <Grid.Item span={6} >
                                <AutoCenter><Image src={imageLocation + 'vote_title.png'} fit='contain' height={'1.1em'}></Image></AutoCenter>
                            </Grid.Item>
                            <Grid.Item span={3} >
                            </Grid.Item>

                            <Grid.Item span={4} >
                                <div className="dao-title">{this.state.lang.button.votes}</div>
                            </Grid.Item>
                            <Grid.Item span={5}>
                                <div>
                                    <Input
                                        style={{ '--color': 'black', '--text-align': 'center', '--font-size': '1rem', }}
                                        clearable
                                        value={this.state.inputVotes}
                                        onChange={val => {
                                            this.setState({ inputVotes: val });
                                        }}
                                    />
                                </div>
                            </Grid.Item>
                            <Grid.Item span={3}>
                            </Grid.Item>
                            <Grid.Item span={4} >
                                <div className="dao-title">{this.state.lang.button.candidate}</div>
                            </Grid.Item>
                            <Grid.Item span={5}>
                                <div>
                                    <Input
                                        style={{ '--color': 'black', '--text-align': 'center', '--font-size': '1rem', }}
                                        clearable
                                        value={this.state.inputElected}
                                        onChange={val => {
                                            this.setState({ inputElected: val });
                                        }}
                                    />
                                </div>
                            </Grid.Item>
                            <Grid.Item span={3}>
                                <AutoCenter>
                                    <Image src={imageLocation + 'button_submit.png'} fit='contain' width={50} onClick={() => this.vote()}></Image>
                                </AutoCenter>
                            </Grid.Item>
                        </Grid>
                    </List.Item>
                </List>
            )
        }
        let cardLeaderboard = () => {
            return (
                <List
                    mode='card'
                    style={{
                        backgroundImage: `url(./images/dao/bg_05.png)`,
                        backgroundSize: '100% 100%',
                        padding: "0.5rem",
                        margin: '1rem',
                    }}>
                    <List.Item>
                        <Grid columns={12} gap={8} style={{ '--gap-vertical': '0.8rem' }}>
                            <Grid.Item span={3} style={{ display: 'grid', alignItems: 'center' }} >
                                <div className='dao-title' style={{ display: 'grid', alignItems: 'center' }}>{this.state.lang.button.winner}</div>
                            </Grid.Item>
                            <Grid.Item span={6} style={{ display: 'grid', alignItems: 'center' }}>
                                <div className='dao-text' style={{ display: 'grid', alignItems: 'center' }}>
                                    {!voteFlag ? <DaoCountDown dayText={this.state.lang.days} endTime={this.state.voteStartTime} /> : <span style={{ whiteSpace: 'pre-wrap' }}>00:00:00    0 {this.state.lang.days}</span>}
                                </div>
                            </Grid.Item>
                            <Grid.Item span={3}>
                                <AutoCenter>
                                    {
                                        sameDay(Math.ceil(new Date().getTime() / 1000), this.state.updateTime) ?
                                            <Button disabled size='mini' style={{ '--background-color': '#C1C0C0', '--border-radius': '10px' }}><CountTimeDown className='dao-text' endTime={exp} /></Button>
                                            :
                                            <Image src={imageLocation + 'button_trigger.png'} fit='contain' width={50} onClick={() => this.trigger()}></Image>
                                    }
                                </AutoCenter>
                            </Grid.Item>
                            <Grid.Item span={3}>
                                <div className='dao-title'>{this.state.lang.button.vote}</div>
                            </Grid.Item>
                            <Grid.Item span={6}>
                                <div className='dao-text'>{voteFlag ? <DaoCountDown dayText={this.state.lang.days} endTime={this.state.voteEndTime} /> : <span style={{ whiteSpace: 'pre-wrap' }}>00:00:00    0 {this.state.lang.days}</span>}</div>
                            </Grid.Item>
                            <Grid.Item span={3}></Grid.Item>
                            <Grid.Item span={3}>
                                <div className='dao-title'>{this.state.lang.button.voted}</div>
                            </Grid.Item>
                            <Grid.Item span={4}>
                                <div className='dao-text'>{this.state.allMyVotes}</div>
                            </Grid.Item>
                            <Grid.Item span={2}>
                            </Grid.Item>
                            <Grid.Item span={3}>
                                <AutoCenter>
                                    <Image src={imageLocation + 'button_revoke.png'} fit='contain' width={50} onClick={() => this.revoke()}></Image>
                                </AutoCenter>
                            </Grid.Item>
                            <Grid.Item span={3}>
                                <div className='dao-title'>{this.state.lang.button.rewards}</div>
                            </Grid.Item>
                            <Grid.Item span={4}>
                                <div className='dao-text'>{this.state.myRewards}</div>
                            </Grid.Item>
                            <Grid.Item span={2}>
                                <div className='dao-text'>MIDAFI</div>
                            </Grid.Item>
                            <Grid.Item span={3}>
                                <AutoCenter>
                                    <Image src={imageLocation + 'button_withdraw.png'} fit='contain' width={50} onClick={() => this.withdrawVoterRewards()}></Image>
                                </AutoCenter>
                            </Grid.Item>
                            <Grid.Item span={3}>
                                <div className='dao-title'>{this.state.lang.button.totalVotes}</div>
                            </Grid.Item>
                            <Grid.Item span={4}>
                                <div className='dao-text'>{this.state.currentVotes}</div>
                            </Grid.Item>
                            <Grid.Item span={5}>
                            </Grid.Item>
                            <Grid.Item span={2}><div className='leaderboard-header'>{this.state.lang.header.rank}</div></Grid.Item>
                            <Grid.Item span={4}><div className='leaderboard-header'>{this.state.lang.header.votes}</div></Grid.Item>
                            <Grid.Item span={6}><div className='leaderboard-header'>{this.state.lang.header.candidate}</div></Grid.Item>
                            <Grid.Item span={2}>
                                <Image src='./images/dao/icon_1.png' fit='contain' height={'1em'} />
                            </Grid.Item>
                            <Grid.Item span={4}>
                                <div className='dao-text'>{this.state.winnerVote0}</div>
                            </Grid.Item>
                            <Grid.Item span={6}>
                                <div className='dao-text' onClick={() => this.copyWithFeedback(this.state.winnerElected0)}>{showAddr(this.state.winnerElected0, 4)}</div>
                            </Grid.Item>
                            <Grid.Item span={2}><div className='leaderboard-header'>2</div></Grid.Item>
                            <Grid.Item span={4}>
                                <div className='dao-text'>{this.state.winnerVote1}</div>
                            </Grid.Item>
                            <Grid.Item span={6}>
                                <div className='dao-text' onClick={() => this.copyWithFeedback(this.state.winnerElected1)}>{showAddr(this.state.winnerElected1, 4)}</div>
                            </Grid.Item>
                            <Grid.Item span={2}><div className='leaderboard-header'>3</div></Grid.Item>
                            <Grid.Item span={4}>
                                <div className='dao-text'>{this.state.winnerVote2}</div>
                            </Grid.Item>
                            <Grid.Item span={6}>
                                <div className='dao-text' onClick={() => this.copyWithFeedback(this.state.winnerElected2)}>{showAddr(this.state.winnerElected2, 4)}</div>
                            </Grid.Item>
                            <Grid.Item span={2}><div className='leaderboard-header'>4</div></Grid.Item>
                            <Grid.Item span={4}>
                                <div className='dao-text'>{this.state.winnerVote3}</div>
                            </Grid.Item>
                            <Grid.Item span={6}>
                                <div className='dao-text' onClick={() => this.copyWithFeedback(this.state.winnerElected3)}>{showAddr(this.state.winnerElected3, 4)}</div>
                            </Grid.Item>
                            <Grid.Item span={2}><div className='leaderboard-header'>5</div></Grid.Item>
                            <Grid.Item span={4}>
                                <div className='dao-text'>{this.state.winnerVote4}</div>
                            </Grid.Item>
                            <Grid.Item span={6}>
                                <div className='dao-text' onClick={() => this.copyWithFeedback(this.state.winnerElected4)}>{showAddr(this.state.winnerElected4, 4)}</div>
                            </Grid.Item>
                            <Grid.Item span={2}><div className='leaderboard-header'>6</div></Grid.Item>
                            <Grid.Item span={4}>
                                <div className='dao-text'>{this.state.winnerVote5}</div>
                            </Grid.Item>
                            <Grid.Item span={6}>
                                <div className='dao-text' onClick={() => this.copyWithFeedback(this.state.winnerElected5)}>{showAddr(this.state.winnerElected5, 4)}</div>
                            </Grid.Item>
                            <Grid.Item span={4}><div className='dao-title'>{this.state.lang.button.lastVotes}</div></Grid.Item>
                            <Grid.Item span={8}><div className='dao-text'>{this.state.lastWinnerVotes}</div></Grid.Item>
                            <Grid.Item span={4}><div className='dao-title'>{this.state.lang.button.lastWinner}</div></Grid.Item>
                            <Grid.Item span={8}><div className='dao-text' onClick={() => this.copyWithFeedback(this.state.lastWinnerElectedStr)}>{showAddr(this.state.lastWinnerElectedStr, 4)}</div></Grid.Item>
                        </Grid>
                    </List.Item>
                </List>
            )
        }
        let menuTitle = () => {
            return (
                <div style={{ position: "absolute", top: "0", width: "100%", maxWidth: "600px" }}>
                    <Grid columns={12} gap={8}>
                        <Grid.Item span={2}>
                            <AutoCenter>
                                <Button size='mini' fill='none' style={{ marginTop: '0.5rem' }}
                                    onClick={() => {
                                        Modal.alert({
                                            closeOnMaskClick: true,
                                            showCloseButton: true,
                                            title: this.state.lang.rules.title,
                                            content: <ConfigProvider locale={this.state.locale}>
                                                <div>
                                                    <span style={{ whiteSpace: 'pre-wrap', fontSize: '1rem' }}>
                                                        {this.state.lang.rules.content1}
                                                        <a href={GITHUB}>{GITHUB}</a>
                                                    </span>
                                                    <span style={{ whiteSpace: 'pre-wrap', fontSize: '1rem' }}>
                                                        {this.state.lang.rules.content2}
                                                        <a href={GITEE}>{GITEE}</a>
                                                    </span>
                                                    <span style={{ whiteSpace: 'pre-wrap', fontSize: '1rem' }}>
                                                        {this.state.lang.rules.content3}
                                                        <a href={NETLIFY}>{NETLIFY}</a>
                                                    </span>
                                                    <span style={{ whiteSpace: 'pre-wrap', fontSize: '1rem' }}>
                                                        {this.state.lang.rules.content4}
                                                    </span>
                                                    <span style={{ fontSize: '1rem' }} onClick={() => this.copyWithFeedback(voteAddr)}>
                                                        {voteAddr}
                                                    </span>
                                                    <span style={{ whiteSpace: 'pre-wrap', fontSize: '1rem' }}>
                                                        {this.state.lang.rules.content5}
                                                    </span>
                                                    <span style={{ fontSize: '1rem' }} onClick={() => this.copyWithFeedback(BURN_ADDR)}>
                                                        {BURN_ADDR}
                                                    </span>
                                                </div>
                                            </ConfigProvider>,
                                        })
                                    }}
                                >{this.state.lang.rules.title}
                                </Button>
                            </AutoCenter>
                        </Grid.Item>
                        <Grid.Item span={6}>
                        </Grid.Item>
                        <Grid.Item span={4}
                            style={{
                                display: 'flex',
                                justifyContent: 'end',
                                paddingRight: '0.5rem',
                            }}>
                            <Popover.Menu
                                actions={[
                                    { key: 'en_US', text: 'English' },
                                    { key: 'zh_HK', text: "中文" },
                                ]}
                                onAction={node => {
                                    Toast.show({
                                        content: <span style={{ color: 'white' }}>{this.state.lang.changeToLang} {node.text}</span>,
                                    });
                                    this.changeLocale(node.key);
                                }}
                                placement='bottom-left'
                                trigger='click'
                            >
                                <Button size='mini' fill='none' style={{ marginTop: '0.5rem' }}>{this.state.lang.language}</Button>
                            </Popover.Menu>
                        </Grid.Item>
                        <Grid.Item span={4}><Popover
                            content={
                                <List style={{ '--padding-left': '0', '--padding-right': '0', '--prefix-padding-right': '0' }}>
                                    <List.Item>
                                        <a href={document.location.protocol + '//' + document.location.host} style={{ display: 'flex', justifyContent: 'center' }}>
                                            <Image src={IMAGE_ROOT + '../staking/icon_mpm.png'} fit='contain' width={41} />
                                        </a>
                                    </List.Item>
                                    <List.Item>
                                        <a href='https://0.zailuo.cn/seromidafi' style={{ display: 'flex', justifyContent: 'center' }}>
                                            <Image src={IMAGE_ROOT + '../staking/icon_telegram.png'} fit='contain' width={41} />
                                        </a>
                                    </List.Item>
                                    <List.Item>
                                        <a href={document.location.protocol + '//' + document.location.host} style={{ display: 'flex', justifyContent: 'center' }}>
                                            <Image src={IMAGE_ROOT + '../staking/icon_dao.png'} fit='contain' width={41} />
                                        </a>
                                    </List.Item>
                                    <List.Item>
                                        <a href='https://corswap.sero.cash?1664281242997' style={{ display: 'flex', justifyContent: 'center' }}>
                                            <Image src={IMAGE_ROOT + '../staking/icon_swap.png'} fit='contain' width={41} />
                                        </a>
                                    </List.Item>
                                </List>
                            }
                            trigger='click'
                            placement='bottom'
                        >
                            <Image src="./images/dao/logo2.png" fit='contain' height={45} />
                        </Popover>
                        </Grid.Item>
                        <Grid.Item span={8}>
                        </Grid.Item>
                    </Grid>
                </div>
            )
        }
        return (
            <div style={{ backgroundColor: "#C0CEDA" }}>
                <ConfigProvider locale={this.state.locale}>
                    {menuTitle()}
                    <Image src="./images/dao/header2.png" />
                    {cardAccount()}
                    {cardWinner()}
                    {cardInfo()}
                    {cardVote()}
                    {cardLeaderboard()}
                    <Grid columns={3} gap={8}>
                        <Grid.Item span={1}>
                        </Grid.Item>
                        <Grid.Item span={1} style={{ display: 'flex', justifyContent: 'center' }}>
                            <Tag fill='outline'>
                                <span className='staking-footer'>{this.state.lang.riskWarning}</span>
                            </Tag>
                        </Grid.Item>
                        <Grid.Item span={1}>
                        </Grid.Item>
                    </Grid>
                    <Divider />
                </ConfigProvider>
            </div>
        )
    }
}

function isValidPkr(pkr) {
    if (pkr.length < 131 || pkr.length > 132) {
        return false;
    }
    var patten = /^[0-9a-zA-Z]+$/;
    return patten.test(pkr);
}

export default Dao;