import React, { Component } from 'react';
import { Modal, Toast, List, WhiteSpace, WingBlank, InputItem, Button, Flex } from "antd-mobile-v2"; //, Card
import BigNumber from 'bignumber.js'
import copy from "copy-text-to-clipboard/index"
import { language, defaultCode } from './language'
import abi from "./abi";
import { decimals, sameDay, showPK, showCode } from "./utils";
import CountTimeDown from "./countTimeDown";
import Background from '../img/bg2.png';
import yxhg from '../img/hg1.png';
import heros_cn from '../img/heros_cn.png';
import heros_en from '../img/heros_en.png';
import multiTrigger from './MultiTrigger';

const operation = Modal.operation;

function alert(content) {
  Modal.alert(content, "", [{ text: language.e().button.ok }])
}

class Mpm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: { pk: "", mainPKr: "", name: "", balance: 0, token: 0 },
      details: {
        lcode: "",
        rcode: "",
        parentCode: "",
        directCode: "",
        value: 0,
        totalInvestment: 0,
        totalStaticReward: 0,
        totalDynamicReward: 0,
        totalCollideReward: 0,
        totalDynamicDirectReward: 0,
        totalWinReward: 0,
        canWithdrawValue: 0,
        lAmount: 0,
        rAmount: 0,
        lTotalAmount: 0,
        rTotalAmount: 0,
        lchildsCode: "",
        rchildsCode: "",
        staticReward: 0,
        staticTimestamp: 0,
        dynamicReward: 0,
        collideReward: 0,
        dynamicDirectReward: 0,
        dayRecommendAmount: 0,
        dayReward: 0,
        lValues: [0],
        rValues: [0],
        isLeft: 1,
        token: 0,
      },
      lang: "Language",
      winnerList: [],
      preWinnerList: [],
      winnerPool: 0,
      preWinnerPool: 0,
      gdMsg: 'none',
      fonts: '1',
      accountList: [],
    }
    this.showMsg = this.showMsg.bind(this);
  }

  initAccount(mainPkr) {
    let self = this;
    abi.details(mainPkr, function (details) {
      if (details.lValues.length === 0) {
        details.lValues = [0]
      }
      if (details.rValues.length === 0) {
        details.rValues = [0]
      }
      details.token = details.airdrop;
      self.setState({ details: details });
    });

    abi.getWinners(mainPkr, function (details) {
      self.setState({
        winnerList: details.winnerList,
        preWinnerList: details.preWinnerList,
        preWinnerPool: details.preWinnerPool,
        winnerPool: details.winnerPool
      })
    });
  }

  componentDidMount() {
    // console.log("did mount");
    let accountList = [];
    let self = this;
    abi.OnInit.then(() => {
      abi.accountList(function (accounts) {
        accounts.forEach(function (item, index) {
          // console.log("process item", item);
          accountList.push({
            label: item.name + "(" + item.mainPKr + ")",
            value: item.mainPKr,
            account: item,
          });
        });
        // console.log("got accountList =>", accountList);
        self.setState({
          account: accounts[0],
          accountList: accountList,
        });
        // console.log("accountList =>", self.state.accountList);
        self.initAccount(accounts[0].mainPKr);
        self.timer = setInterval(function () {
          self.initAccount(self.state.account.mainPKr);
        }, 10 * 1000);
      });
    }).catch(() => {
      alert("init failed")
    });

    this.setState({
      lang: language.e().text,
    })
  }

  onTimeout() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  onOk = (val) => {
    if (val.length !== 1) {
      return;
    }
    var selected;
    this.accountList.forEach(function (item, index) {
      if (item.account.mainPKr === val[0]) {
        selected = item.account;
      }
    });
    this.setState({ account: selected });
    this.initAccount(this.state.account.mainPKr);
  }

  showMsg() {
    var { gdMsg } = this.state
    gdMsg = gdMsg === 'none' ? 'block' : 'none';
    this.setState({ gdMsg: gdMsg });

  }

  trigger() {
    if (!sameDay(parseInt(new Date().getTime() / 1000), this.state.details.staticTimestamp)) {
      abi.triggerStaticProfit(this.state.account.pk, this.state.account.mainPKr, () => {
        console.log("first tx down, commit second now");
        multiTrigger.trigger(this.state.account.pk, this.state.account.mainPKr);
      });
    }
  }

  invest() {
    let value = this.valueInput.state.value;
    if (!value) {
      alert(language.e().new.qsr);
      return
    }

    if (value < 10) {
      alert(language.e().new.qsrj);
      return
    }

    let code = "";
    if (this.state.details.lcode === "" || this.state.details.rcode === "") {
      code = this.codeInput.state.value;
      if (!code) {
        alert(language.e().new.qsrjd);
        return
      }
      if (code && typeof code === "string") {
        code = code.trim();
      }
    }

    let directCode = "";
    if (this.state.details.lcode === "" || this.state.details.rcode === "") {
      directCode = this.directCodeInput.state.value;
      if (!directCode) {
        alert(language.e().new.qsr);
        return
      }
      if (directCode && typeof directCode === "string") {
        directCode = directCode.trim();
      }
    }
    value = new BigNumber(value).multipliedBy(new BigNumber(10).pow(18));
    abi.invest(this.state.account.pk, this.state.account.mainPKr, value, directCode, code, function (ret) {
    });
  }

  withdraw() {
    if (this.state.details.canWithdraw !== 0) {
      abi.withdraw(this.state.account.pk, this.state.account.mainPKr, function (ret) {
      });
    }
  }

  withdrawToken() {
    if (this.state.details.token !== 0) {
      abi.withdrawAirdrop(this.state.account.pk, this.state.account.mainPKr, function (ret) {
      });
    }
  }

  reinvest() {
    if (this.state.details.canWithdraw !== 0) {
      let self = this;
      let inputs = <div>
        <InputItem type='money' clear moneyKeyboardAlign='left' ref={el => {
          this.reinvestInput = el
        }} placeholder=">=10,不填则全部复投"><span>{language.e().account.modal.value}:</span></InputItem>
      </div>
      Modal.alert(<span>{language.e().account.reinvest}</span>, inputs, [
        { text: <span>{language.e().account.modal.cancel}</span> },
        {
          text: <span>{language.e().account.modal.submit}</span>, onPress: () => {
            let value = new BigNumber(self.reinvestInput.state.value).multipliedBy(1e18).toNumber();
            abi.reinvest(this.state.account.pk, this.state.account.mainPKr, value, function (ret) {
            });
          }
        },
      ]);
    }
  }

  takePartIn() {
    let defCode = "";
    let directDefCode = "";
    if (this.state.details.parentCode !== "") {
      defCode = this.state.details.parentCode;
      directDefCode = this.state.details.directCode;
    }
    let inputs = <div>
      <InputItem clear ref={el => {
        this.directCodeInput = el
      }} editable={(this.state.details.lcode === "" && this.state.details.rcode === "")} placeholder="directCode"
        defaultValue={showCode(directDefCode, 2, 4)}><span className="column-title">{language.e().new.ztm}:</span></InputItem>

      <InputItem clear ref={el => {
        this.codeInput = el
      }} editable={(this.state.details.lcode === "" && this.state.details.rcode === "")} placeholder="code"
        defaultValue={showCode(defCode, 2, 4)}><span className="column-title">{language.e().new.jdm}:</span></InputItem>

      <InputItem type='money' clear moneyKeyboardAlign='left' ref={el => {
        this.valueInput = el
      }} placeholder=">=10"><span>{language.e().new.je}:</span></InputItem>
    </div>
    Modal.alert(<span>{language.e().new.tz}</span>, inputs, [
      { text: <span>{language.e().new.qx}</span> },
      {
        text: <span>{language.e().new.tj}</span>, onPress: () => {
          this.invest();
        }
      },
    ])
    if (this.state.details.code === "") {
      this.codeInput.focus();
    } else {
      this.valueInput.focus();
    }
  }

  changAccount() {
    let self = this;
    let actions = [];
    self.state.accountList.forEach(function (item, index) {
      let account = item.account;
      actions.push(
        {
          text: <span>{showPK(account.name, account.pk, 10)}</span>, onPress: () => {
            self.setState({ account: account });
            self.initAccount(account.mainPKr);
          }
        }
      );
    });
    operation(actions);
  }

  setLang = (_lang) => {
    let lang = "语言"
    var fonts = '1'
    // const localLanguage = localStorage.getItem("language");
    if (_lang === "zh_CN") {
      lang = "语言";
      fonts = 1;
    } else if (_lang === "en_US") {
      lang = "Language";
      fonts = 0.8;
    } else if (_lang === "ko_KR") {
      lang = "언어";
    } else if (_lang === "ja_JP") {
      lang = "言語";
    } else if (_lang === "be_BY") {
      lang = "язык";
    }
    localStorage.setItem("language", _lang)
    this.setState({
      lang: lang,
      fonts: fonts
    })
  }

  render() {
    let self = this;
    let lLen = this.state.details.lValues.length;
    let rLen = this.state.details.rValues.length;
    let Values = lLen >= rLen ? this.state.details.lValues : this.state.details.rValues;

    let winners = self.state.winnerList.map((item, index) => {
      return (
        <List.Item
          key={index}
          style={{ borderRadius: (index === Values.length - 1) ? '0 0 5px 5px' : '' }}>
          <Flex justify='start' align='center'>
            <div style={{ float: "left", width: '10%', textAlign: 'center' }}>
              <Icon index={index} />
            </div>
            <div style={{ float: "left", width: '30%', textAlign: 'center' }}>
              <span className="column-title">
                {index === 0 ? language.e().topPlayer : index + 1}
              </span>
            </div>
            <div style={{ float: "left", width: '30%', textAlign: 'center' }}>
              <span className="column-title">
                {decimals(item.amount, 18, 3)}
              </span>
            </div>
            <div style={{ float: "left", width: '30%', textAlign: 'center' }}>
              <span className="column-title">
                {item.code.slice(0, 4) + ".." + item.code.slice(-4)}
              </span>
            </div>
          </Flex>
        </List.Item>
      )
    });

    let winnersNo = () => {
      if (self.state.winnerList.length === 0) {
        return (
          <List.Item style={{ borderRadius: '0 0 5px 5px' }}>
            <Flex justify='start' align='center'>
              <div style={{ float: "left", width: '10%', textAlign: 'center' }}>
                <span className="column-title">
                  {'-'}
                </span>
              </div>
              <div style={{ float: "left", width: '30%', textAlign: 'center' }}>
                <span className="column-title">
                  {'-'}
                </span>
              </div>
              <div style={{ float: "left", width: '30%', textAlign: 'center' }}>
                <span className="column-title">
                  {'-'}
                </span>
              </div>
              <div style={{ float: "left", width: '30%', textAlign: 'center' }}>
                <span className="column-title">
                  {'-'}
                </span>
              </div>
            </Flex>
          </List.Item>
        )
      }
    }

    let rank = 0;
    let lastWinner = "-";
    let lastWinPerf = "-";
    // console.log("preWinnerList:", self.state.preWinnerList);
    self.state.preWinnerList.forEach(function (item, index) {
      if (index === 0) {
        lastWinner = item.code.slice(0, 4) + ".." + item.code.slice(-4);
        lastWinPerf = decimals(item.amount, 18, 3)
      }
      if (item.code === self.state.details.lcode) {
        rank = index + 1;
      }
    });

    let herosTitle = () => {
      const lang = localStorage.getItem("language");
      if (lang === "en_US") {
        return (
          <List.Item>
            <div style={{ height: '1rem' }}>
            </div>
            <div className='div_flex z'>
              <div style={{ width: '5rem', position: 'relative', zIndex: 2, height: '1.5rem', backgroundImage: `url(${heros_en})`, backgroundSize: '100% 100%' }}>
              </div>
            </div>
            <div className='div_flex z'>
              <div
                className='yximg'
                style={{ width: '5.5rem', height: '1.5rem', backgroundImage: `url(${yxhg})`, backgroundRepeat: 'no-repeat', backgroundSize: '50% 100%' }}>
              </div>
            </div>
          </List.Item>
        )
      } else {
        return (
          <List.Item>
            <div style={{ height: '1rem' }}>
            </div>
            <div className='div_flex z'>
              <div style={{ width: '5rem', position: 'relative', zIndex: 2, height: '1.5rem', backgroundImage: `url(${heros_cn})`, backgroundSize: '100% 100%' }}>
              </div>
            </div>
            <div className='div_flex z'>
              <div
                className='yximg'
                style={{ width: '5.5rem', height: '1.5rem', backgroundImage: `url(${yxhg})`, backgroundRepeat: 'no-repeat', backgroundSize: '50% 100%' }}>
              </div>
            </div>
          </List.Item>
        )
      }
    }

    rank = rank > 0 ? rank : "-";
    let exp = new Date().getTime() + 129600000 - (new Date().getHours() * 60 * 60 + new Date().getMinutes() * 60 + new Date().getSeconds()) * 1000;
    let totalDirectReward = this.state.details.totalDynamicDirectReward;
    let totalDynamicReward = this.state.details.totalDynamicReward;
    let totalCollideReward = this.state.details.totalCollideReward - this.state.details.collideReward;
    let totalStaticReward = this.state.details.totalStaticReward
      - this.state.details.totalDynamicReward
      - this.state.details.totalDynamicDirectReward
      - this.state.details.totalCollideReward
      + this.state.details.collideReward;
    let totalReward = totalDirectReward + totalDynamicReward + totalCollideReward + totalStaticReward + this.state.details.totalWinReward;
    let estimateReward = this.state.details.value - this.state.details.totalStaticReward;
    return (
      <div style={{ backgroundImage: `url(${Background})`, backgroundSize: '100% 100%', }}>
        <div style={{ position: "absolute", top: "0", width: "100%", maxWidth: "600px" }}>
          <span
            style={{ float: "left", padding: "15px" }}
            onClick={() => {
              Modal.alert(
                <span >
                  {language.e().account.rule}
                </span>,
                <div
                  className="contractRule"
                  style={{ height: document.documentElement.clientHeight * 0.6 }}>
                  <pre style={{ 'whiteSpace': 'pre-wrap', fontSize: '1rem' }}>
                    {language.e().rule}
                  </pre>
                  <span style={{ 'whiteSpace': 'pre-wrap' }}>
                    {language.e().rule1}
                  </span>
                  <span
                    style={{ color: '#989898', marginLeft: '0.5rem' }}
                    onClick={() => {
                      copy(defaultCode);
                      Toast.success(language.e().copySucc, 1);
                    }}
                  >
                    <span style={{ color: '#c0a26d' }}>
                      {language.e().copy}
                    </span>
                  </span>
                  <br />
                  <br />
                </div>,
                [{ text: <span>OK</span> }]
              )
            }}>
            <span style={{ color: "#fff" }}>
              {language.e().account.rule}
            </span>
          </span>
          <span
            style={{ float: "right", padding: "15px", }}
            onClick={() => {
              Modal.operation([
                { text: <span>中文</span>, onPress: () => this.setLang('zh_CN') },
                { text: <span>English</span>, onPress: () => this.setLang('en_US') },
              ])
            }}>
            <span style={{ color: "#fff" }}>
              {this.state.lang}
            </span>
          </span>
        </div>

        <div className="header" >
          <img alt='header'
            src={require('../img/header.png')}
            width="100%"
          />
          <br />
        </div>

        <WhiteSpace size="lg" />
        <WingBlank size="lg" >
          <List>
            <List.Item
              onClick={
                () => Modal.alert(language.e().switchAccount.title, language.e().switchAccount.message, [
                  { text: language.e().button.cancel },
                  { text: language.e().button.ok, onPress: this.changAccount.bind(this) },
                ])
              }
              style={{ borderRadius: '5px 5px 0 0' }}>
              <Flex>
                <Flex.Item>
                  <div>
                    <span className="column-title">{language.e().account.name}</span>
                  </div>
                  <div style={{ float: 'left' }}>
                    <span className="column-value">{showPK(this.state.account.name, this.state.account.pk)}</span>
                  </div>
                </Flex.Item>
                <Flex.Item>
                  <Button style={{ float: 'right' }}>
                    {language.e().account.change}
                  </Button>
                </Flex.Item>
              </Flex>
            </List.Item>
            <List.Item>
              <Flex>
                <Flex.Item>
                  <span className="column-title">{language.e().account.balance}:</span>
                </Flex.Item>
                <Flex.Item>
                  <span className="column-value">
                    {decimals(this.state.account.balance, 18, 2)}
                  </span>
                </Flex.Item>
                <Flex.Item>
                  <span className="column-title">{language.e().account.token}:</span>
                </Flex.Item>
                <Flex.Item>
                  <span className="column-value">
                    {decimals(this.state.account.token, 18, 2)}
                  </span>
                </Flex.Item>
              </Flex>
            </List.Item>
          </List>
        </WingBlank>
        <WhiteSpace size="lg" />

        <WingBlank size="lg">
          <List>
            <List.Item><span className="column-title">{language.e().mpmAccount}</span></List.Item>
            <List.Item wrap>
              <span className="column-title">{language.e().account.canWithdraw}: </span><span className="column-value">{decimals(this.state.details.canWithdrawValue, 18, 2)}</span>
              <div style={{ float: 'right' }}>
                <Button
                  size="big"
                  inline
                  disabled={this.state.details.canWithdrawValue === 0}
                  onClick={() => { this.withdraw() }}>
                  {language.e().account.withdraw}
                </Button>
                <Button
                  size="big"
                  inline
                  style={{ marginLeft: '0.5rem' }}
                  disabled={this.state.details.canWithdrawValue < 1e+19}
                  onClick={() => { this.reinvest(); }}>
                  {language.e().account.reinvest}
                </Button>
              </div>
            </List.Item>
            <List.Item
              wrap>
              <span className="column-title">{language.e().account.tokenInContract}: </span><span className="column-value">{decimals(this.state.details.token, 18, 2)}</span>
              <div style={{ float: 'right' }}>
                <Button
                  size="big" inline
                  disabled={this.state.details.token === 0}
                  onClick={() => { this.withdrawToken() }}>
                  {language.e().account.withdraw}
                </Button>
              </div>
            </List.Item>
            <List.Item wrap >
              <Flex justify='start' align='center'>
                <div style={{ float: "left", width: '50%', textAlign: 'left' }}>
                  <span className="column-title">{language.e().account.value}: </span>
                  <span className="column-value">{decimals(estimateReward, 18, 2)}</span>
                </div>
                <div style={{ float: "left", width: '20%', textAlign: 'right' }}>
                  <QuotaWarningImg warn={this.state.details.collideReward > estimateReward} />
                  {/* <QuotaWarningImg warn={true} /> */}
                </div>
                <div style={{ float: "left", width: '30%', textAlign: 'right' }}>
                  <Button
                    size="small" inline
                    onClick={() => { this.takePartIn() }}>
                    {language.e().account.invest}
                  </Button>
                </div>
              </Flex>
            </List.Item>
            <List.Item wrap extra={
              <Button
                inline
                disabled={(this.state.details.value <= this.state.details.totalStaticReward) || sameDay(Math.ceil(new Date().getTime() / 1000), this.state.details.staticTimestamp)}
                onClick={() => { this.trigger(); }}>
                {
                  sameDay(Math.ceil(new Date().getTime() / 1000), this.state.details.staticTimestamp) ?
                    <CountTimeDown endTime={exp} />
                    : language.e().account.trigger
                }
              </Button>}>
              <span className="column-title">{language.e().account.totalReward2}: </span>
              <span className="column-value">{decimals(totalReward, 18, 2)}</span>
            </List.Item>
            <List.Item>
              <Flex>
                <Flex.Item>
                  <div style={{ textAlign: 'center' }}>
                    <span className="column-title">{language.e().account.recommend.ltotal}</span>
                  </div>
                </Flex.Item>
                <Flex.Item>
                  <div style={{ textAlign: 'center' }}>
                    <span className="column-title">{language.e().account.recommend.rtotal}</span>
                  </div>
                </Flex.Item>
              </Flex>
            </List.Item>
            <List.Item>
              <Flex>
                <Flex.Item>
                  <div style={{ textAlign: 'center' }}>
                    <span className="column-value">
                      {decimals(self.state.details.lTotalAmount, 18, 2)}
                    </span>
                  </div>
                </Flex.Item>
                <Flex.Item>
                  <div style={{ textAlign: 'center' }}>
                    <span className="column-value">
                      {decimals(self.state.details.rTotalAmount, 18, 2)}
                    </span>
                  </div>
                </Flex.Item>
              </Flex>
            </List.Item>

            <List.Item>
              <Flex>
                <Flex.Item>
                  <div style={{ textAlign: 'center' }}>
                    <span className="column-title">{language.e().account.recommend.linvitationCode}</span>
                  </div>
                </Flex.Item>
                <Flex.Item>
                  <div style={{ textAlign: 'center' }}>
                    <span className="column-title">{language.e().account.recommend.rinvitationCode}</span>
                  </div>
                </Flex.Item>
              </Flex>
            </List.Item>
            <List.Item>
              <Flex>
                <Flex.Item>
                  <div style={{ textAlign: 'center' }}>
                    <span className="column-title">
                      {this.state.details.lcode}
                    </span>
                  </div>
                </Flex.Item>
                <Flex.Item>
                  <div style={{ textAlign: 'center' }}>
                    <span className="column-title">
                      {this.state.details.rcode}
                    </span>
                  </div>
                </Flex.Item>
              </Flex>
            </List.Item>
            <List.Item>
              <Flex>
                <Flex.Item>
                  <div style={{ textAlign: 'center' }}>
                    <Button inline
                      size="big"
                      disabled={this.state.details.lcode === ""}
                      onClick={() => {
                        copy(this.state.details.lcode);
                        Toast.success(language.e().copySucc, 1);
                      }}>
                      {language.e().copy}
                    </Button>
                  </div>
                </Flex.Item>
                <Flex.Item>
                  <div style={{ textAlign: 'center' }}>
                    <Button inline
                      size="big"
                      disabled={this.state.details.rcode === ""}
                      onClick={() => {
                        copy(this.state.details.rcode);
                        Toast.success(language.e().copySucc, 1);
                      }}>
                      {language.e().copy}
                    </Button>
                  </div>
                </Flex.Item>
              </Flex>
            </List.Item>

            <List.Item>
              <Flex>
                <Flex.Item>
                </Flex.Item>
                <Flex.Item>
                </Flex.Item>
                <Flex.Item>
                  <Button size="small" onClick={this.showMsg}>
                    {
                      this.state.gdMsg === 'none' ? language.e().more : language.e().less
                    }
                  </Button>
                </Flex.Item>
                <Flex.Item>
                </Flex.Item>
                <Flex.Item>
                </Flex.Item>
              </Flex>
            </List.Item>
          </List>
        </WingBlank>
        <WhiteSpace size="lg" />

        <WingBlank
          size="lg"
          style={{ display: this.state.gdMsg }}>
          <List>
            <List.Item>
              <span className="column-title">{language.e().account.staticReward}: </span>
              <span className="column-value">{decimals(this.state.details.staticReward, 18, 2)}</span>
            </List.Item>
            <List.Item>
              <span className="column-title">{language.e().account.dynamicDirectReward}: </span>
              <span className="column-value">{decimals(this.state.details.dynamicDirectReward, 18, 2)}</span>
            </List.Item>
            <List.Item>
              <span className="column-title">{language.e().account.dynamicReward}: </span>
              <span className="column-value">{decimals(this.state.details.dynamicReward, 18, 2)}</span>
            </List.Item>
            <List.Item wrap >
              <span className="column-title">{language.e().account.collideReward}: </span>
              <span className="column-value">{decimals(this.state.details.collideReward, 18, 2)}</span>
            </List.Item>
            <List.Item>
              <span className="column-title">{language.e().account.dayReward}: </span>
              <span className="column-value">
                {decimals(this.state.details.dayReward, 18, 3)}
              </span>
              <div style={{ float: 'right', marginRight: '4rem' }}>
                <QuotaWarningImg warn={this.state.details.collideReward > (this.state.details.value - this.state.details.totalStaticReward)} />
                {/* <QuotaWarningImg warn={true} /> */}
              </div>
            </List.Item>
          </List>
        </WingBlank>
        <WhiteSpace
          size="lg"
          style={{ display: this.state.gdMsg }} />

        <WingBlank
          size="lg"
          style={{ display: this.state.gdMsg }}>
          <List>
            <List.Item>
              <span className="column-title">{language.e().account.totalStaticReward}: </span>
              <span className="column-value">
                {decimals(totalStaticReward, 18, 2)}
              </span>
            </List.Item>
            <List.Item>
              <span className="column-title">{language.e().account.totalDynamicDirectReward}: </span>
              <span className="column-value">
                {decimals(totalDirectReward, 18, 2)}
              </span>
            </List.Item>
            <List.Item>
              <span className="column-title">{language.e().account.totalDynamicReward}: </span>
              <span className="column-value">
                {decimals(totalDynamicReward, 18, 2)}
              </span>
            </List.Item>
            <List.Item>
              <span className="column-title">{language.e().account.totalCollideReward}: </span>
              <span className="column-value">
                {decimals(totalCollideReward, 18, 2)}
              </span>
            </List.Item>
            <List.Item>
              <span className="column-title">{language.e().account.totalWinReward}: </span>
              <span className="column-value">
                {decimals(this.state.details.totalWinReward, 18, 2)}
              </span>
            </List.Item>
            <List.Item>
              <span className="column-title">{language.e().account.totalInvestment}: </span>
              <span className="column-value">
                {decimals(this.state.details.totalInvestment, 18, 2)} SERO
              </span>
            </List.Item>
            <List.Item>
              <span className="column-title">{language.e().account.totalReward}: </span>
              <span className="column-value">{decimals(totalReward, 18, 2)} SERO</span>
            </List.Item>
          </List>
        </WingBlank>
        <WhiteSpace
          size="lg"
          style={{ display: this.state.gdMsg }} />

        <WingBlank>
          <List>
            <WhiteSpace size="sm" />
            <List.Item>
              <Flex>
                <Flex.Item>
                </Flex.Item>
                <Flex.Item>
                  <div style={{ float: 'center', width: '100%' }}>
                    <img alt='player'
                      src={require("../img/" + language.e().background.player + ".png")}
                      style={{ float: 'center', width: '100%', height: '1.6rem' }} />
                  </div>
                </Flex.Item>
                <Flex.Item>
                </Flex.Item>
              </Flex>
            </List.Item>
            <List.Item>
              <Flex justify="center">
                <Flex.Item>
                </Flex.Item>
                <Flex.Item>
                  <div style={{ float: 'center' }}>
                    <img alt='sun'
                      src={require("../img/sun.png")}
                      style={{ width: '100%', height: '100%' }} />
                  </div>
                </Flex.Item>
                <Flex.Item>
                </Flex.Item>
              </Flex>
            </List.Item>
            <List.Item>
              <Flex justify="center">
                <Flex.Item>
                </Flex.Item>
                <Flex.Item>
                  <div className='div_flex z'>
                    <div style={{ color: 'red', fontSize: '1.2rem' }}>
                      <CountTimeDown endTime={exp} />
                    </div>
                  </div>
                </Flex.Item>
                <Flex.Item>
                </Flex.Item>
              </Flex>
            </List.Item>
            <List.Item style={{ borderRadius: '0 0 5px 5px' }}>
              <Flex>
                <Flex.Item>
                  <span className="medium-font">{language.e().new.jrjl}</span>
                </Flex.Item>
                <Flex.Item>
                  <div style={{ textAlign: 'center' }}>
                    <span className="big-font">
                      {decimals(new BigNumber(new BigNumber(this.state.winnerPool)) * 0.05, 18, 3)}
                    </span>
                  </div>
                </Flex.Item>
                <Flex.Item>
                </Flex.Item>
              </Flex>
              <div style={{ float: 'left' }}>

              </div>
            </List.Item>
            {herosTitle()}
            <List.Item>
              <Flex justify='start' align='center'>
                <div style={{ float: "left", width: '10%', textAlign: 'center' }}>
                  <span className="column-title">
                  </span>
                </div>
                <div style={{ float: "left", width: '30%', textAlign: 'center' }}>
                  <span className="column-title">
                    {language.e().headerNo}
                  </span>
                </div>
                <div style={{ float: "left", width: '30%', textAlign: 'center' }}>
                  <span className="column-title">
                    {language.e().headerPerf}
                  </span>
                </div>
                <div style={{ float: "left", width: '30%', textAlign: 'center' }}>
                  <span className="column-title">
                    {language.e().headerCode}
                  </span>
                </div>
              </Flex>
            </List.Item>
            {winners}
            {winnersNo()}
            <List.Item>
              <Flex justify='start' align='center'>
                <div style={{ float: "left", width: '10%', textAlign: 'center' }}>
                  <Icon index={0} />
                </div>
                <div style={{ float: "left", width: '30%', textAlign: 'center' }}>
                  <span className="column-title">{language.e().topPlayerYesterday}</span>
                </div>
                <div style={{ float: "left", width: '30%', textAlign: 'center' }}>
                  <span className="column-value">
                    {lastWinPerf}
                  </span>
                </div>
                <div style={{ float: "left", width: '30%', textAlign: 'center' }}>
                  <span className="column-value">
                    {lastWinner}
                  </span>
                </div>
              </Flex>
            </List.Item>
            <List.Item style={{ borderRadius: '0 0 5px 5px' }}>
              <div style={{ float: 'left' }}>
                <span className="column-title">{language.e().new.zrjl}: </span>
                <span className="column-value">
                  {decimals(new BigNumber(new BigNumber(this.state.preWinnerPool)) * 0.05, 18, 3)}
                </span>
              </div>
            </List.Item>
            <List.Item>
              <div style={{ float: 'left' }}>
                <span className="column-title">{language.e().new.zrwd}: </span>
                <span className="column-value">
                  {rank}
                </span>
              </div>
            </List.Item>
          </List>
        </WingBlank>
        <div className='div_flex z'>
          {language.e().new.zycy}
        </div>
        <WhiteSpace size="lg" />
      </div>
    )
  }
}

function Icon(props) {
  const index = props.index;
  if (index === 0) {
    return (<img alt=''
      src={require("./mpm_li_" + (index + 1) + ".png")}
      style={{ width: '1.2rem', height: '1rem' }} />);
  }
  return (
    <img alt=''
      src={require("./mpm_li_" + (index + 1) + ".png")}
      style={{ width: '1rem', height: '0.8rem' }} />);
}

function QuotaWarningImg(props) {
  const warn = props.warn;
  if (warn) {
    return (
      <img alt='warning' src={require("../img/warning.png")} style={{ marginLeft: '1rem', width: '2.4rem', height: '1.8rem' }} />
    );
  }
  return (<span></span>);
}

export default Mpm;
