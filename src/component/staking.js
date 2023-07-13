import React, { Component } from 'react';
import "./staking.css";
import HeaderImg from '../img/staking/header.png';
import Frame1 from '../img/frame1.png';
import Frame2 from '../img/frame2.png';
import CountTimeDown from "./countTimeDown";
import {
    Toast, List, Modal,
    Image, Input, Popover, Divider, Button,
    ConfigProvider,
    Grid, Tag, AutoCenter, setDefaultConfig
} from "antd-mobile";
import BigNumber from 'bignumber.js';
import copy from "copy-text-to-clipboard/index";
import seropp from 'sero-pp';
import abi from "./abi";
import { decimals, sameDay, showPK, computePower } from "./utils";
import { GridItem } from 'antd-mobile/es/components/grid/grid';
import zhHK from 'antd-mobile/es/locales/zh-HK'
import enUS from 'antd-mobile/es/locales/en-US';
import zh_HK from './staking_zh_HK';
import en_US from './staking_en_US';
import treasury from './treasury';
import pool, { poolAddr } from './pool';
import multiTrigger from './MultiTrigger';
import JSONBigNumber from 'json-bignumber';

const MIDAFI_CURRENCY = "MIDAFI";

const IMAGE_ROOT = './images/staking/';
const GITHUB = "https://github.com/MIDAFITOM/mpm";
const GITEE = "https://gitee.com/midafitom/mpm2";
const NETLIFY = 'https://midafi.netlify.app/';

BigNumber.set({ ROUNDING_MODE: BigNumber.ROUND_DOWN });

class Staking extends Component {
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
            mpmTotalInvestment: new BigNumber(0),
            hashRate: 100,
            dailyQuota: new BigNumber(0),
            staked: 0,
            totalStakedValid: new BigNumber(0),
            interest: 0,
            gas: 0,
            centennialMidafi: 0,
            centennialSero: 0,

            
            inputWithdrawInterest: "",
            showWithdrawInterestModal: false,
            inputReinvest: "",
            showReinvestModal: false,
            inputMidafiInvesting: "", // 想要参与的MIDAFI额度
            showDepositMidafiModal: false,
            inputMidafiWithdrawing: "0",
            showWithdrawMidafiModal: false,
            inputSeroInvesting: "",
            showDepositSeroModal: false,
            inputSeroWithdrawing: "0",
            showWithdrawSeroModal: false,

            inputCentennialMidafiDeposit: "",
            showCentennialDepositMidafiModal: false,
            inputCentennialMidafiWithdraw: "",
            showCentennialWithdrawMidafiModal: false,
            inputCentennialSeroWithdraw: "",
            showCentennialWithdrawSeroModal: false,
        };
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

    copyWithFeedback(text) {
        copy(text);
        Toast.show({
            content: <span style={{ color: 'white' }}>{this.state.lang.tip.addrCopied}</span>
        });
    }

    async initAccount(mainPKr) {
        abi.details(mainPKr, (details) => {
            this.setState({
                mpmTotalInvestment: details.totalInvestment,
                hashRate: computePower(details.totalInvestment),
            });
        });
        multiTrigger.poolStatus(mainPKr, (json_) => {
            if (json_ === '0x0') {
                return;
            }
            const j = JSONBigNumber.parse(json_);
            this.setState({
                staked: j.staked,
                inputMidafiWithdrawing: j.staked.dividedBy(1e18).toString(10),
                interest: j.interest,
                inputWithdrawInterest: j.interest.dividedBy(1e18).toString(10),
                inputReinvest: j.interest.dividedBy(1e18).toString(10),
                gas: j.gas,
                centennialMidafi: j.md,
                inputCentennialMidafiWithdraw: j.md.dividedBy(1e18).toString(10),
                centennialSero: j.sd,
                inputCentennialSeroWithdraw: j.sd.dividedBy(1e18).toString(10),
                updateTime: j.updateTime.toNumber(),
            });
        });
    }
    async initSystemInfo(mainPKr) {
        multiTrigger.poolInfo(mainPKr, (json_) => {
            if (json_ === '0x0') {
                return;
            }
            const j = JSONBigNumber.parse(json_);
            this.setState({
                dailyQuota: j.dailyQuota,
                totalStakedValid: j.totalStakedValid,
            });
        });
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

    depositToTreasury(currency, value) {
        treasury.deposit(this.state.account.PK, this.state.account.MainPKr, currency, value, function (res) {
        });
    }

    depositMidafi(amount, weight) {
        pool.depositMidafi(this.state.account.PK, this.state.account.MainPKr, amount, weight, function (res) { console.log(res) });
    }
    showWithdrawInterestModal() {
        // console.log("show withdraw interest modal now");
        this.setState({ showWithdrawInterestModal: true });
    }
    closeWithdrawInterestModal() {
        // console.log("close withdraw interest modal now");
        this.setState({ showWithdrawInterestModal: false });
    }
    showReinvestModal() {
        // console.log("show withdraw interest modal now");
        this.setState({ showReinvestModal: true });
    }
    closeReinvestModal() {
        // console.log("close withdraw interest modal now");
        this.setState({ showReinvestModal: false });
    }

    showDepositMidafiModal() {
        this.setState({ showDepositMidafiModal: true });
    }
    closeDepositMidafiModal() {
        this.setState({ showDepositMidafiModal: false });
    }

    withdrawMidafi(amount) {
        pool.withdrawMidafi(this.state.account.PK, this.state.account.MainPKr, amount, function (res) { console.log(res) });
    }

    showWithdrawMidafiModal() {
        this.setState({ showWithdrawMidafiModal: true });
    }
    closeWithdrawMidafiModal() {
        this.setState({ showWithdrawMidafiModal: false });
    }

    centennialDepositMidafi(amount) {
        pool.centennialDepositMidafi(this.state.account.PK, this.state.account.MainPKr, amount, function (res) { console.log(res) });
    }
    showCentennialDepositMidafiModal() {
        this.setState({ showCentennialDepositMidafiModal: true });
    }
    closeCentennialDepositMidafiModal() {
        this.setState({ showCentennialDepositMidafiModal: false });
    }
    centennialWithdrawMidafi(amount) {
        pool.centennialWithdrawMidafi(this.state.account.PK, this.state.account.MainPKr, amount, function (res) { console.log(res) });
    }
    showCentennialWithdrawMidafiModal() {
        this.setState({ showCentennialWithdrawMidafiModal: true });
    }
    closeCentennialWithdrawMidafiModal() {
        this.setState({ showCentennialWithdrawMidafiModal: false });
    }
    centennialWithdrawSero(amount) {
        pool.centennialWithdrawSero(this.state.account.PK, this.state.account.MainPKr, amount, function (res) { console.log(res) });
    }
    showCentennialWithdrawSeroModal() {
        this.setState({ showCentennialWithdrawSeroModal: true });
    }
    closeCentennialWithdrawSeroModal() {
        this.setState({ showCentennialWithdrawSeroModal: false });
    }

    partnerWithdraw(amount, index) {
        pool.partnerWithdraw(this.state.account.PK, this.state.account.MainPKr, amount, index);
    }
    daoWithdraw() {
        pool.daoWithdraw(this.state.account.PK, this.state.account.MainPKr);
    }

    depositSero(amount) {
        pool.depositSero(this.state.account.PK, this.state.account.MainPKr, amount, function (res) {
        });
    }

    showDepositSeroModal() {
        this.setState({ showDepositSeroModal: true });
    }
    closeDepositSeroModal() {
        this.setState({ showDepositSeroModal: false });
    }

    withdrawSero(amount) {
        pool.withdrawSero(this.state.account.PK, this.state.account.MainPKr, amount, function (res) {
        });
    }
    showWithdrawSeroModal() {
        this.setState({ showWithdrawSeroModal: true });
    }
    closeWithdrawSeroModal() {
        this.setState({ showWithdrawSeroModal: false });
    }

    claim() {
        multiTrigger.trigger(this.state.account.PK, this.state.account.MainPKr);
    }

    profit(amount) {
        pool.profit(this.state.account.PK, this.state.account.MainPKr, amount)
    }

    reinvest(amount) {
        pool.reinvest(this.state.account.PK, this.state.account.MainPKr, amount)
    }

    render() {
        let exp = new Date().getTime() + 129600000 - (new Date().getHours() * 60 * 60 + new Date().getMinutes() * 60 + new Date().getSeconds()) * 1000;
        let imageLocation = IMAGE_ROOT + this.state.lang.imageLocation + '/';
        let apy = new BigNumber(0);
        if (this.state.totalStakedValid > 0) {
            apy = this.state.dailyQuota;
            apy = apy.dividedBy(this.state.totalStakedValid).multipliedBy(36500);
        }
        apy = apy.toFixed(2);
        let currentAccount = showPK(this.state.account.Name, this.state.account.MainPKr, 4);
        let quota = new BigNumber(this.state.mpmTotalInvestment).dividedBy(100).minus(this.state.centennialMidafi);
        if (quota.isNegative()) {
            quota = new BigNumber(0);
        }

        let showCard = () => {
            return (
                <Grid columns={12} gap={8} style={{ '--gap-vertical': '0.8rem' }}>
                    <Grid.Item span={3}>
                        <span className="midafi-header">MIDAFI</span>
                    </Grid.Item>
                    <Grid.Item span={3}>
                        <AutoCenter>
                            <span className="staking-number">{decimals(this.state.interest, 18, 2)}</span>
                        </AutoCenter>
                    </Grid.Item>
                    <Grid.Item span={2} >
                    </Grid.Item>
                    <Grid.Item span={2} style={{ display: 'flex', justifyContent: 'end' }}>
                        <Image src={imageLocation + 'button_withdraw.png'} fit='contain' width={50} height={28} onClick={() =>
                            this.showWithdrawInterestModal()
                        } />
                        <Modal
                            visible={this.state.showWithdrawInterestModal}
                            showCloseButton={true}
                            onClose={() => this.closeWithdrawInterestModal()}
                            closeOnMaskClick={true}
                            content={
                                <List mode='card'>
                                    <List.Item>
                                        <Grid columns={1} gap={8}>
                                            <GridItem>
                                                <AutoCenter>
                                                    <span className='staking-prompt'>{this.state.lang.input.promptWithdrawInterest}</span>
                                                </AutoCenter>
                                            </GridItem>
                                            <GridItem>
                                                <AutoCenter>
                                                    <Input className='staking-input' clearable
                                                        style={{ '--text-align': 'center', '--font-size': '1rem' }}
                                                        value={this.state.inputWithdrawInterest}
                                                        onChange={val => {
                                                            this.setState({ inputWithdrawInterest: val });
                                                        }}
                                                    />
                                                </AutoCenter>
                                            </GridItem>
                                            <GridItem>
                                                <AutoCenter>
                                                    <Button size='small'
                                                        onClick={() => {
                                                            this.closeWithdrawInterestModal();
                                                            this.profit(new BigNumber(this.state.inputWithdrawInterest).multipliedBy(1e18))
                                                        }}>
                                                        {this.state.lang.button.ok}
                                                    </Button>
                                                </AutoCenter>
                                            </GridItem>
                                        </Grid>
                                    </List.Item>
                                </List>
                            }
                        />
                    </Grid.Item>
                    <Grid.Item span={2} style={{ display: 'flex', justifyContent: 'end' }}>
                        <Image src={imageLocation + 'button_reinvest.png'} fit='contain' width={50} height={28} onClick={() =>
                            // this.reinvest(this.state.interest)
                            this.showReinvestModal()
                        } />
                        <Modal
                            visible={this.state.showReinvestModal}
                            showCloseButton={true}
                            onClose={() => this.closeReinvestModal()}
                            closeOnMaskClick={true}
                            content={
                                <List mode='card'>
                                    <List.Item>
                                        <Grid columns={1} gap={8}>
                                            <GridItem>
                                                <AutoCenter>
                                                    <span className='staking-prompt'>{this.state.lang.input.promptReinvest}</span>
                                                </AutoCenter>
                                            </GridItem>
                                            <GridItem>
                                                <AutoCenter>
                                                    <Input className='staking-input' clearable
                                                        style={{ '--text-align': 'center', '--font-size': '1rem' }}
                                                        value={this.state.inputReinvest}
                                                        onChange={val => {
                                                            this.setState({ inputReinvest: val });
                                                        }}
                                                    />
                                                </AutoCenter>
                                            </GridItem>
                                            <GridItem>
                                                <AutoCenter>
                                                    <Button size='small'
                                                        onClick={() => {
                                                            this.closeReinvestModal();
                                                            this.reinvest(new BigNumber(this.state.inputReinvest).multipliedBy(1e18))
                                                        }}>
                                                        {this.state.lang.button.ok}
                                                    </Button>
                                                </AutoCenter>
                                            </GridItem>
                                        </Grid>
                                    </List.Item>
                                </List>
                            }
                        />
                    </Grid.Item>
                    <Grid.Item span={3}>
                        <span className="midafi-header">{this.state.lang.text.staking}</span>
                    </Grid.Item>
                    <Grid.Item span={3}>
                        <AutoCenter>
                            <span className="staking-number">{decimals(this.state.staked, 18, 2)}</span>
                        </AutoCenter>
                    </Grid.Item>
                    <Grid.Item span={2}>
                        <AutoCenter>
                            <span className="midafi-header">MIDAFI</span>
                        </AutoCenter>
                    </Grid.Item>
                    <Grid.Item span={2} style={{ display: 'flex', justifyContent: 'end' }} >
                        <Image src={imageLocation + 'button_invest.png'} fit='contain' width={50} height={28} onClick={() =>
                            this.showDepositMidafiModal()
                        } />
                        <Modal
                            visible={this.state.showDepositMidafiModal}
                            showCloseButton={true}
                            onClose={() => this.closeDepositMidafiModal()}
                            closeOnMaskClick={true}
                            content={
                                <List mode='card'>
                                    <List.Item>
                                        <Grid columns={1} gap={8}>
                                            <GridItem>
                                                <AutoCenter>
                                                    <span className='staking-prompt'>{this.state.lang.input.promptDepositMidafi}</span>
                                                </AutoCenter>
                                            </GridItem>
                                            <GridItem>
                                                <AutoCenter>
                                                    <Input className='staking-input' clearable
                                                        style={{ '--text-align': 'center', '--font-size': '1rem' }}
                                                        value={this.state.inputMidafiInvesting}
                                                        onChange={val => {
                                                            this.setState({ inputMidafiInvesting: val });
                                                        }}
                                                    />
                                                </AutoCenter>
                                            </GridItem>
                                            <GridItem>
                                                <AutoCenter>
                                                    <Button size='small'
                                                        onClick={() => {
                                                            this.closeDepositMidafiModal();
                                                            // console.log('you will invest %s MIDAFI', this.state.inputMidafiInvesting);
                                                            this.depositMidafi(new BigNumber(this.state.inputMidafiInvesting).multipliedBy(1e18), this.state.hashRate);
                                                        }}>
                                                        {this.state.lang.button.ok}
                                                    </Button>
                                                </AutoCenter>
                                            </GridItem>
                                        </Grid>
                                    </List.Item>
                                </List>
                            }
                        />
                    </Grid.Item>
                    <Grid.Item span={2} style={{ display: 'flex', justifyContent: 'end' }} >
                        <Image src={imageLocation + 'button_exit.png'} fit='contain' width={50} height={28} onClick={
                            () => this.showWithdrawMidafiModal()
                        } />
                        <Modal
                            visible={this.state.showWithdrawMidafiModal}
                            showCloseButton={true}
                            onClose={() => this.closeWithdrawMidafiModal()}
                            closeOnMaskClick={true}
                            content={
                                <List mode='card'>
                                    <List.Item>
                                        <Grid columns={1} gap={8}>
                                            <GridItem>
                                                <AutoCenter>
                                                    <span className='staking-prompt'>{this.state.lang.input.promptDepositMidafi}</span>
                                                </AutoCenter>
                                            </GridItem>
                                            <GridItem>
                                                <AutoCenter>
                                                    <Input className='staking-input' clearable
                                                        style={{ '--text-align': 'center', '--font-size': '1rem' }}
                                                        value={this.state.inputMidafiWithdrawing}
                                                        onChange={val => {
                                                            this.setState({ inputMidafiWithdrawing: val });
                                                        }}
                                                    />
                                                </AutoCenter>
                                            </GridItem>
                                            <GridItem>
                                                <AutoCenter>
                                                    <Button size='small'
                                                        onClick={() => {
                                                            this.closeWithdrawMidafiModal();
                                                            this.withdrawMidafi(new BigNumber(this.state.inputMidafiWithdrawing).multipliedBy(1e18));
                                                        }}
                                                    >{this.state.lang.button.ok}</Button>
                                                </AutoCenter>
                                            </GridItem>
                                        </Grid>
                                    </List.Item>
                                </List>
                            }
                        />
                    </Grid.Item>
                    <Grid.Item span={3}>
                        <span className="midafi-header">{this.state.lang.text.gas}</span>
                    </Grid.Item>
                    <Grid.Item span={3}>
                        <AutoCenter>
                            <span className="staking-number">{decimals(this.state.gas, 18, 2)}</span>
                        </AutoCenter>
                    </Grid.Item>
                    <Grid.Item span={2}>
                        <AutoCenter>
                            <span className="midafi-header">SERO</span>
                        </AutoCenter>
                    </Grid.Item>
                    <Grid.Item span={2} style={{ display: 'flex', justifyContent: 'end' }}>
                        <Image src={imageLocation + 'button_add.png'} fit='contain' width={50} height={28} onClick={
                            () => this.showDepositSeroModal()
                        } />
                        <Modal
                            visible={this.state.showDepositSeroModal}
                            showCloseButton={true}
                            onClose={() => this.closeDepositSeroModal()}
                            closeOnMaskClick={true}
                            content={
                                <List mode='card'>
                                    <List.Item>
                                        <Grid columns={1} gap={8}>
                                            <GridItem>
                                                <AutoCenter>
                                                    <span className='staking-prompt'>{this.state.lang.input.promptWithdrawSero}</span>
                                                </AutoCenter>
                                            </GridItem>
                                            <GridItem>
                                                <AutoCenter>
                                                    <Input className='staking-input' clearable
                                                        style={{ '--text-align': 'center', '--font-size': '1rem' }}
                                                        value={this.state.inputSeroInvesting}
                                                        onChange={val => {
                                                            this.setState({ inputSeroInvesting: val });
                                                        }}
                                                    />
                                                </AutoCenter>
                                            </GridItem>
                                            <GridItem>
                                                <AutoCenter>
                                                    <Button size='small'
                                                        onClick={() => {
                                                            this.closeDepositSeroModal();
                                                            this.depositSero(new BigNumber(this.state.inputSeroInvesting).multipliedBy(1e18));
                                                        }}
                                                    >{this.state.lang.button.ok}</Button>
                                                </AutoCenter>
                                            </GridItem>
                                        </Grid>
                                    </List.Item>
                                </List>
                            }
                        />
                    </Grid.Item>
                    <Grid.Item span={2} style={{ display: 'flex', justifyContent: 'end' }}>
                        <Image src={imageLocation + 'button_reduce.png'} fit='contain' width={50} height={28} onClick={
                            () => this.showWithdrawSeroModal()
                        } />
                        <Modal
                            visible={this.state.showWithdrawSeroModal}
                            showCloseButton={true}
                            onClose={() => this.closeWithdrawSeroModal()}
                            closeOnMaskClick={true}
                            content={
                                <List mode='card'>
                                    <List.Item>
                                        <Grid columns={1} gap={8}>
                                            <GridItem>
                                                <AutoCenter>
                                                    <span className='staking-prompt'>{this.state.lang.input.promptWithdrawSero}</span>
                                                </AutoCenter>
                                            </GridItem>
                                            <GridItem>
                                                <AutoCenter>
                                                    <Input className='staking-input' clearable
                                                        style={{ '--text-align': 'center', '--font-size': '1rem' }}
                                                        value={this.state.inputSeroWithdrawing}
                                                        onChange={val => {
                                                            this.setState({ inputSeroWithdrawing: val });
                                                        }}
                                                    />
                                                </AutoCenter>
                                            </GridItem>
                                            <GridItem>
                                                <AutoCenter>
                                                    <Button size='small'
                                                        onClick={() => {
                                                            this.closeWithdrawSeroModal();
                                                            this.withdrawSero(new BigNumber(this.state.inputSeroWithdrawing).multipliedBy(1e18));
                                                        }}
                                                    >{this.state.lang.button.ok}</Button>
                                                </AutoCenter>
                                            </GridItem>
                                        </Grid>
                                    </List.Item>
                                </List>
                            }
                        />
                    </Grid.Item>
                    <Grid.Item span={3}>
                        <span className="midafi-header">{this.state.lang.text.apy}</span>
                    </Grid.Item>
                    <Grid.Item span={5}>
                        <span className="staking-number">
                            {apy} %
                        </span>
                    </Grid.Item>
                    <Grid.Item span={4} style={{ display: 'flex', justifyContent: 'end' }}>
                        {
                            sameDay(Math.ceil(new Date().getTime() / 1000), this.state.updateTime) ?
                                <Button disabled size='small'><CountTimeDown endTime={exp} /></Button>
                                :
                                <Image src={imageLocation + 'button_trigger.png'} fit='contain' width={50} height={28} onClick={() =>
                                    this.claim()
                                } />
                        }
                    </Grid.Item>
                    <Grid.Item span={3}>
                        <span className="midafi-header">{this.state.lang.text.computingPower}</span>
                    </Grid.Item>
                    <Grid.Item span={3}>
                        <AutoCenter>
                            <HashRate actual={this.state.hashRate} target={100}></HashRate>
                        </AutoCenter>
                    </Grid.Item>
                    <Grid.Item span={3}>
                        <AutoCenter>
                            <HashRate actual={this.state.hashRate} target={110}></HashRate>
                        </AutoCenter>
                    </Grid.Item>
                    <Grid.Item span={3}>
                        <AutoCenter>
                            <HashRate actual={this.state.hashRate} target={120}></HashRate>
                        </AutoCenter>
                    </Grid.Item>
                    <Grid.Item span={3}>
                    </Grid.Item>
                    <Grid.Item span={3}>
                        <AutoCenter>
                            <HashRate actual={this.state.hashRate} target={130}></HashRate>
                        </AutoCenter>
                    </Grid.Item>
                    <Grid.Item span={3}>
                        <AutoCenter>
                            <HashRate actual={this.state.hashRate} target={140}></HashRate>
                        </AutoCenter>
                    </Grid.Item>
                    <Grid.Item span={3}>
                        <AutoCenter>
                            <HashRate actual={this.state.hashRate} target={150}></HashRate>
                        </AutoCenter>
                    </Grid.Item>

                    <Grid.Item span={12}>
                        <span className="midafi-header">{this.state.lang.text.centennialDividend}</span>
                    </Grid.Item>
                    <Grid.Item span={3}></Grid.Item>
                    <Grid.Item span={3}>
                        <AutoCenter>
                            <span className="staking-number">{decimals(this.state.centennialMidafi, 18, 2)}</span>
                        </AutoCenter>
                    </Grid.Item>
                    <Grid.Item span={2}>
                        <AutoCenter>
                            <span className="midafi-header">MIDAFI</span>
                        </AutoCenter>
                    </Grid.Item>
                    <Grid.Item span={2} style={{ display: 'flex', justifyContent: 'end' }} >
                        <Image src={imageLocation + 'button_invest.png'} fit='contain' width={50} height={28} onClick={() =>
                            this.showCentennialDepositMidafiModal()
                        } />
                        <Modal
                            visible={this.state.showCentennialDepositMidafiModal}
                            showCloseButton={true}
                            onClose={() => this.closeCentennialDepositMidafiModal()}
                            closeOnMaskClick={true}
                            content={
                                <List mode='card'>
                                    <List.Item>
                                        <Grid columns={10} gap={8}>
                                            <GridItem span={6}>
                                                <span className='staking-prompt'>{this.state.lang.input.prompt1}</span>
                                            </GridItem>
                                            <GridItem span={4} style={{
                                                display: 'flex',
                                                justifyContent: 'flex-end',
                                            }}>
                                                <span className='staking-prompt'>{decimals(this.state.mpmTotalInvestment, 18, 2)}</span>
                                            </GridItem>
                                            <GridItem span={6}>
                                                <span className='staking-prompt'>{this.state.lang.input.prompt2}</span>
                                            </GridItem>
                                            <GridItem span={4} style={{
                                                display: 'flex',
                                                justifyContent: 'flex-end',
                                            }}>
                                                <span className='staking-prompt'>{decimals(this.state.mpmTotalInvestment, 20, 2)}</span>
                                            </GridItem>
                                            <GridItem span={6}>
                                                <span className='staking-prompt'>{this.state.lang.input.prompt3}</span>
                                            </GridItem>
                                            <GridItem span={4} style={{
                                                display: 'flex',
                                                justifyContent: 'flex-end',
                                            }}>
                                                <span className='staking-prompt'>{decimals(this.state.centennialMidafi, 18, 2)}</span>
                                            </GridItem>
                                            <GridItem span={6}>
                                                <span className='staking-prompt'>{this.state.lang.input.prompt4}</span>
                                            </GridItem>
                                            <GridItem span={4} style={{
                                                display: 'flex',
                                                justifyContent: 'flex-end',
                                            }}>
                                                <span className='staking-prompt'>{decimals(quota, 18, 2)}</span>
                                            </GridItem>
                                            <GridItem span={10}>
                                                <AutoCenter>
                                                    <span className='staking-prompt'>{this.state.lang.input.promptDepositMidafi}</span>
                                                </AutoCenter>
                                            </GridItem>
                                            <GridItem span={10}>
                                                <AutoCenter>
                                                    <Input className='staking-input' type="number" min={0} max={quota} clearable
                                                        style={{ '--text-align': 'center', '--font-size': '1rem' }}
                                                        value={this.state.inputCentennialMidafiDeposit}
                                                        onChange={val => {
                                                            this.setState({ inputCentennialMidafiDeposit: val });
                                                        }}
                                                    />
                                                </AutoCenter>
                                            </GridItem>
                                            <GridItem span={10}>
                                                <AutoCenter>
                                                    <Button size='small' onClick={() => {
                                                        this.closeCentennialDepositMidafiModal();
                                                        this.centennialDepositMidafi(new BigNumber(this.state.inputCentennialMidafiDeposit).multipliedBy(1e18), this.state.hashRate);
                                                    }}>
                                                        <span className='staking-prompt'>{this.state.lang.button.ok}</span>
                                                    </Button>
                                                </AutoCenter>
                                            </GridItem>
                                        </Grid>
                                    </List.Item>
                                </List>
                            }
                        />
                    </Grid.Item>
                    <Grid.Item span={2} style={{ display: 'flex', justifyContent: 'end' }} >
                        <Image src={imageLocation + 'button_withdraw.png'} fit='contain' width={50} height={28} onClick={
                            () => this.showCentennialWithdrawMidafiModal()
                        } />
                        <Modal
                            visible={this.state.showCentennialWithdrawMidafiModal}
                            showCloseButton={true}
                            onClose={() => this.closeCentennialWithdrawMidafiModal()}
                            closeOnMaskClick={true}
                            content={
                                <List mode='card'>
                                    <List.Item>
                                        <Grid columns={1} gap={8}>
                                            <GridItem>
                                                <AutoCenter>
                                                    <span className='staking-prompt'>{this.state.lang.input.promptDepositMidafi}</span>
                                                </AutoCenter>
                                            </GridItem>
                                            <GridItem>
                                                <AutoCenter>
                                                    <Input className='staking-input' clearable
                                                        style={{ '--text-align': 'center', '--font-size': '1rem' }}
                                                        value={this.state.inputCentennialMidafiWithdraw}
                                                        onChange={val => {
                                                            this.setState({ inputCentennialMidafiWithdraw: val });
                                                        }}
                                                    />
                                                </AutoCenter>
                                            </GridItem>
                                            <GridItem>
                                                <AutoCenter>
                                                    <Button size='small' onClick={() => {
                                                        this.closeCentennialWithdrawMidafiModal();
                                                        this.centennialWithdrawMidafi(new BigNumber(this.state.inputCentennialMidafiWithdraw).multipliedBy(1e18));
                                                    }}>
                                                        <span className='staking-prompt'>{this.state.lang.button.ok}</span>
                                                    </Button>
                                                </AutoCenter>
                                            </GridItem>
                                        </Grid>
                                    </List.Item>
                                </List>
                            }
                        />
                    </Grid.Item>
                    <Grid.Item span={3}></Grid.Item>
                    <Grid.Item span={3}>
                        <AutoCenter>
                            <span className="staking-number">{decimals(this.state.centennialSero, 18, 2)}</span>
                        </AutoCenter>
                    </Grid.Item>
                    <Grid.Item span={2}>
                        <AutoCenter>
                            <span className="midafi-header">SERO</span>
                        </AutoCenter>
                    </Grid.Item>
                    <Grid.Item span={2} >
                    </Grid.Item>
                    <Grid.Item span={2} style={{ display: 'flex', justifyContent: 'end' }} >
                        <Image src={imageLocation + 'button_withdraw.png'} fit='contain' width={50} height={28} onClick={
                            () => this.showCentennialWithdrawSeroModal()
                        } />
                        <Modal
                            visible={this.state.showCentennialWithdrawSeroModal}
                            showCloseButton={true}
                            onClose={() => this.closeCentennialWithdrawSeroModal()}
                            closeOnMaskClick={true}
                            content={
                                <List mode='card'>
                                    <List.Item>
                                        <Grid columns={1} gap={8}>
                                            <GridItem>
                                                <AutoCenter>
                                                    <span className='staking-prompt'>{this.state.lang.input.promptWithdrawSero}</span>
                                                </AutoCenter>
                                            </GridItem>
                                            <GridItem>
                                                <AutoCenter>
                                                    <Input className='staking-input' clearable
                                                        style={{ '--text-align': 'center', '--font-size': '1rem' }}
                                                        // placeholder='请输入内容'
                                                        value={this.state.inputCentennialSeroWithdraw}
                                                        onChange={val => {
                                                            this.setState({ inputCentennialSeroWithdraw: val });
                                                        }}
                                                    />
                                                </AutoCenter>
                                            </GridItem>
                                            <GridItem>
                                                <AutoCenter>
                                                    <Button size='small'
                                                        onClick={() => {
                                                            this.closeCentennialWithdrawSeroModal();
                                                            this.centennialWithdrawSero(new BigNumber(this.state.inputCentennialSeroWithdraw).multipliedBy(1e18));
                                                        }}
                                                    ><span className='staking-prompt'>{this.state.lang.button.ok}</span></Button>
                                                </AutoCenter>
                                            </GridItem>
                                        </Grid>
                                    </List.Item>
                                </List>
                            }
                        />
                    </Grid.Item>
                </Grid>
            );
        }
        let menuTitle = () => {
            return (
                <div style={{ position: "absolute", top: "0", width: "100%", maxWidth: "600px" }}>
                    <Grid columns={12} gap={8}>
                        <Grid.Item span={2}>
                            <AutoCenter>
                                <Button size='mini' fill='none' style={{ marginTop: '150px' }}
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
                                                    <span style={{ fontSize: '1rem' }} onClick={() => this.copyWithFeedback(poolAddr)}>
                                                        {poolAddr}
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
                                <Button size='mini' fill='none' style={{ marginTop: '150px' }}>{this.state.lang.language}</Button>
                            </Popover.Menu>
                        </Grid.Item>
                    </Grid>
                </div>
            )
        }

        return (
            <div style={{ backgroundColor: "black" }}>
                <ConfigProvider locale={this.state.locale}>
                    {menuTitle()}
                    <Image src={HeaderImg}></Image>
                    <List
                        mode='card'
                        style={{
                            backgroundImage: `url(${Frame1})`,
                            backgroundSize: '100% 100%',
                            padding: "0.3em",
                            '--border-inner': 'none'
                        }}
                    >
                        <List.Item style={{
                            backgroundColor: "black",
                            border: "0px",
                        }} arrow={false} onClick={() => Modal.alert({
                            closeOnMaskClick: true,
                            showCloseButton: true,
                            title: this.state.lang.changeWallet.title,
                            content: this.state.lang.changeWallet.content,
                            confirmText: this.state.lang.changeWallet.ok,
                            onConfirm: () => this.changeAccount2(),
                        })}>
                            <Grid columns={9} style={{ alignItems: 'center' }}>
                                <Grid.Item span={2}>
                                    <span className='text' style={{ fontSize: 'small' }}>{this.state.lang.wallet}</span>
                                </Grid.Item>
                                <Grid.Item span={5}>
                                    <Button color='primary' fill='outline' size='mini'>
                                        {currentAccount}
                                    </Button>
                                </Grid.Item>
                                <Grid.Item span={2}>
                                    <Image src={imageLocation + 'button_switch.png'} fit='contain' width={50} height={28} />
                                </Grid.Item>
                            </Grid>
                        </List.Item>
                        <List.Item style={{
                            backgroundColor: "black",
                            border: "0px",
                        }}>
                            <Grid columns={9} gap={8} style={{ height: "2em", alignContent: "center" }}>
                                <Grid.Item span={2} >
                                    <span className="text">MIDAFI</span>
                                </Grid.Item>
                                <Grid.Item span={2}>
                                    <span className="staking-number">{this.state.MIDAFI}</span>
                                </Grid.Item>
                                <Grid.Item span={1}>
                                </Grid.Item>
                                <Grid.Item span={2}>
                                    <span className="text">SERO</span>
                                </Grid.Item>
                                <Grid.Item span={2}>
                                    <span className="staking-number">{this.state.SERO}</span>
                                </Grid.Item>
                            </Grid>
                        </List.Item>
                    </List>
                    <List
                        style={{
                            backgroundColor: "black",
                            '--border-top': '0px',
                            '--border-bottom': '0px',
                        }}
                    >
                        <List.Item style={{
                            backgroundColor: "black",
                        }}>
                            <Grid columns={4} gap={8} >
                                <Grid.Item span={1}>
                                    <a href={document.location.protocol + '//' + document.location.host} style={{ display: 'flex', justifyContent: 'center' }}>
                                        <Image src={IMAGE_ROOT + '/icon_mpm.png'} fit='contain' width='50%' height='50%' />
                                    </a>
                                </Grid.Item>
                                <Grid.Item span={1}>
                                    <a href='https://0.zailuo.cn/seromidafi' style={{ display: 'flex', justifyContent: 'center' }}>
                                        <Image src={IMAGE_ROOT + '/icon_telegram.png'} fit='contain' width='50%' height='50%' />
                                    </a>
                                </Grid.Item>
                                <Grid.Item span={1}>
                                    <a href={document.location.protocol + '//' + document.location.host} style={{ display: 'flex', justifyContent: 'center' }}>
                                        <Image src={IMAGE_ROOT + '/icon_dao.png'} fit='contain' width='50%' height='50%' />
                                    </a>
                                </Grid.Item>
                                <Grid.Item span={1}>
                                    <a href='https://corswap.sero.cash?1664281242997' style={{ display: 'flex', justifyContent: 'center' }}>
                                        <Image src={IMAGE_ROOT + '/icon_swap.png'} fit='contain' width='50%' height='50%' />
                                    </a>
                                </Grid.Item>
                            </Grid>
                        </List.Item>
                    </List>
                    <List
                        mode='card'
                        style={{
                            backgroundImage: `url(${Frame2})`,
                            backgroundSize: '100% 100%',
                            backgroundColor: "black",
                            padding: "0.3em",
                        }}
                    >
                        <List.Item style={{
                            backgroundColor: "black",
                            border: "0px",
                        }}>
                            {showCard()}
                        </List.Item>
                    </List>
                    <List
                        mode='card'
                        style={{
                            backgroundColor: "black",
                            marginTop: '0',
                            marginBottom: '0',
                        }}
                    >
                        <List.Item style={{
                            backgroundColor: "black",
                            border: "0px",
                        }}>
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
                        </List.Item>
                    </List>
                    <Divider />
                </ConfigProvider>
            </div>
        )
    }
}

function HashRate(props) {
    if (props.actual === props.target) {
        return <span className="staking-number" style={{ fontWeight: 'bold', color: '#c13b44' }}>{props.target} %</span>;
    } else {
        return <span className="staking-number">{props.target} %</span>;
    }
}

export default Staking;