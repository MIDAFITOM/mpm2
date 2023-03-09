export const defaultCode = '4AK6OWPCHV';
class Language {

    e = () => {
        const lang = localStorage.getItem("language");
        if (lang === "zh_CN") {
            return this.zh_CN;
        } else if (lang === "en_US") {
            return this.en_US;
        } else if (lang === "be_BY") {
            return this.be_BY;
        } else if (lang === "ja_JP") {
            return this.ja_JP;
        } else if (lang === "ko_KR") {
            return this.ko_KR;
        } else {
            let localUtc = new Date().getTimezoneOffset() / 60;
            if (localUtc === -8) {
                return this.zh_CN;
            } else {
                return this.en_US;
            }
        }
    };
    en_US = {
        text: "Language",
        warn: "Venture capital, cautious participation.",
        copySucc: "Copy success",
        copy: "Copy",
        button: {
            ok: "OK",
            cancel: "Cancel"
        },
        switchAccount: {
            title: "Change Acount",
            message: "Are You Sure?",
        },
        more: "More",
        less: "Less",
        winnerPool: "Winner Pool",
        headerNo: "No",
        headerPerf: "Performance",
        headerCode: "Code",
        background: {
          player: "player_en",
          heros: "heros_en"
        },
        topPlayer: 'Top Player',
        topPlayerYesterday: "Yesterday's Top Player",
        picker: {
          select: "Select",
          ok: "OK",
          cancel: "Cancel",
        },
        mpmAccount: "MPM Account",
        quota: "Low Quota",
        new:{
            'qbzh': 'The wallet account',
            'yune': 'balance ',
            'ms' : 'MPM account SERO',
            'mm' : 'MPM account MIDAFI',
            'ft' : 'plural',
            'tq' : 'extract',
            'yj' : 'Expected gross revenue',
            'sj' : 'Actual gross income',
            'cf' : 'trigger',
            'cy' : 'participate',
            'zqz': 'Left area total performance',
            'yqz': 'Right area total performance',
            'zqf': 'Left sector share code',
            'yqf': 'Right sector share code',
            'fz' : 'copy',
            'gd' : 'More and more',
            'jrjl': 'Today\'s Reward',
            'zrjl': "Yesterday's Reward",
            'pm': 'ranking',
            'zt': 'Straight driving performance',
            'bm' : 'coding',
            'thwj': 'No. 1 player',
            'zrthwj': 'Top player of the day',
            'zrwd': 'Yesterday my ranking',
            'dqjtze': 'Current static total',
            'zrjtze': 'Yesterday\'s static total',
            'mrghze': 'Total amount returned per day',
            'hyye': 'Contract balance',
            'acye': 'A pool balance',
            'bcye': 'B pool balance',
            'jra' : 'Enter into pool A',
            'jrb' : 'Enter into pool B',
            'jrj' : 'Rate of entering the jackpot',
            'cfb' : 'Trigger B pool capital rate',
            'acr' : 'A Pool daily interest rate',
            'bcr' : 'B Pool daily interest rate',
            'fxll': 'Share the interest rate',
            'ztll': 'Keep pushing interest rates',
            'lpll': 'Amount of touch interest rates',
            'bccf': 'Whether pool B has been triggered',
            'all' :'Enter A pool, enter B pool,A day interest,B day interest, trigger B pool fund rate, enter prize pool, share, direct push, measure touch',
            'sz' : 'Set',
            'cr': 'Deposit',
            'tjsy': 'Expected revenue line',
            'dtjt':'Day static income',
            'dtzt': 'Direct earnings on the day',
            'dtfx':'Share of revenue on the same day',
            'dtlp': 'Daily volume hit earnings',
            'dtz': 'Total daily income',
            'sjjt': 'Cumulative static income',
            'ljtj': 'Cumulative recommendation income',
            'sjfx':'Cumulative revenue sharing',
            'sjlp': 'Cumulative impact on revenue',
            'ljth': 'Cumulative number one player revenue',
            'zcy': 'Total participation',
            'zsy': 'total revenue',
            'tj': 'submit',
            'ztm': 'Straight stacking',
            'jdm': 'Contact code',
            'SEROsl': 'Number of SERO',
            'qx' : 'cancel',
            'sq' : 'pack up',
            'tz' : 'participation',
            'je' : 'Number of SERO',
            'qsr': 'Please enter the investment amount',
            'qsrj' : 'The investment amount must be 10SERO or greater',
            'qsrjd' : 'Please enter the contact code',
            'qsrzt' : 'Please enter the direct push code',
            'zycy' : 'Free participation, risk control',
        },
        fund: {
            title: "Guarantee funds [Start]",
            poolAmount: "Pool of funds",
            fundAmount: "Guarantee fund",
            total: "Total",
            close: "Lucky codes"
        },
        account: {
            name: "Account",
            title: "Account",
            change: "Change",
            balance: "SERO",
            token: "MIDAFI",
            invest: "Invest",
            withdraw: "Withdraw",
            reinvest: "Reinvest",
            amount: "Amount",
            trigger: "Trigger Income",
            staticReward: "Today's Static Income",
            dynamicReward: "Today's Dynamic Income(Earned)",
            dynamicDirectReward: "Today's Direct Income(Earned)",
            collideReward: "Today's Collide Income(Will Earn)",
            dayReward: "Today's Total Income(Earned)",
            totalStaticReward: "Total Static Income(Earned)",
            totalDynamicReward: "Total Dynamic Income(Earned)",
            totalDynamicDirectReward: "Total Direct Income(Earned)",
            totalCollideReward: "Total Collide Income",
            totalWinReward: "Total Winner's Reward",
            totalInvestment: "Total Investment",
            totalReward: "Total Revenue",
            totalReward2: "Total Revenue",
            canWithdraw: "SERO",
            value: "Expected total revenue",
            returnValue: " Total Fixed Income ",
            totalAynamicReward: " Total Referral Income",
            rule: "Contract Rule",
            tokenInContract: "MIDAFI",

            modal: {
                title: "Invest",
                code: "Invitation code",
                value: "Value",
                cancel: "Cancel",
                submit: "Submit"
            },
            records: {
                id: "ID",
                title: "Records",
                time: "Remaining days",
                amount: "Amount",
                profit: "Profit",
                total: "Total",
                state: "Can Withdraw",
                stateValues: ["Done", "Yes", "No"]
            },
            recommend: {
                title: "Recommend info",
                linvitationCode: "Left Code",
                rinvitationCode: "Right Code",
                invitationCode: "Invitation code",
                inviteNumber: "Number of invitations",
                achievement: "Achievement",

                level: "Level",
                count: "Count",
                profit: "Share profit",
                achieveDetail: "Achievement",
                ltotal: "Left Perf",
                rtotal: "Right Perf",
                state: "Can Gain",
                stateValues: ["Yes", "No"]
            }
        },
        rule: 
`The SERO allocation for all MPM players is as follows: 91% enter the contract pool, 3% enter the top player incentive prize pool, and 6% contract supports finance.

Contract rules:
1. Use the recommendation code as the link relationship, and the recommendation code is divided into direct push code and contact code
      Direct Push Code: Get direct push rewards and top player rewards
      Contact code: as a link between upper and lower performance

2. Participation range: Participate starting from 10 SEROs and can be added infinitely. The combination of dynamic and static is 2 times out. The number of participants or the cumulative number of participants reaches more than 100,000 SERO rewards without burns.

3. Static income
 1) After participating, the static income quota of 2 times the number of participation will be displayed immediately, and this quota can be added infinitely.
 2) The static income is released at 5‰ of the daily income quota balance or weighted and distributed to each participating player with 2% of the contract pool balance.
 3) MPM has an exclusive market balance sine release system. Accurately calculate the ratio between market participation and release. According to the participation of the market, 5‰ of the participant’s static income balance or 2% of the token pool balance is weighted and distributed to all participating players daily in two modes. The release mode is alternately switched to ensure that the daily release of SERO is long, stable and never exhausted.
 4) During the participation process, daily income can be reinvested to increase the income limit.


4. Dynamic income
 1) Direct Push Award: 10% of the number of direct push players who participated in the game, have burns, and the number of participants reached 100,000 SEROs or more without burns.

 2) Volume reward: the left area and the right area can be touched with new performance, and the calculation of the reward is subject to the new performance of the community.
 A. The amount of participation reward distribution ratio
①, 10~499 SERO, 4% touch
②, 500~4999 SERO, touch 6%
③, 5000 ~ 9999 SERO volume touch 8%
④, 10% of the amount of more than 10,000 SERO
 B. The daily cap amount of the volume reward is 100,000 SERO, and the volume reward is unlimited, and the highest rate of the volume reward is 10%.
 C. The amount of reward is settled daily, and the settlement time is 12:00.

 3) Sharing award:
  a) When the cumulative number of participants reaches the following levels, 10% of the static income of the shared player under the umbrella can be taken. The specific algebras available are as follows:
①, 10~4999 SERO, get 1 generation
②, 5000~9999 SERO to get 5 generations
③、10000~14999 SEROs will get 10 generations
④, 15000~19999 SERO, get 11 generations
⑤. With a cumulative participation of 20,000 SEROs, you can permanently enjoy 10% of the static income of the 12-generation shared players.
⑥. Based on the cumulative number of participating SEROs reaching 20,000 SEROs, for every additional 10,000 SEROs, you can permanently enjoy 10% of the static income of the newly added 1 generation of shared players, and up to 10 of the 20 generations of shared players’ static income. %.
  b) The sharing income has burns, that is, when calculating the sharing income, the static income amount of the sharing player and the shared player is calculated as the less; the number of participants or the cumulative number of participants is more than 100,000 without burns.
  c) Sharing income is settled daily, with cash withdrawal and reinvestment possible.

5. The number one player incentive award
  1) The player with the most daily direct push performance is the number one player and will receive 20% of the reward pool. This reward is settled daily and settled on time at 12:00 every day.
  2) Directly push the top six players with the most performance daily, enter the hero list in real time and compete for the top player.
  3) The remaining 80% of the reward pool will be rolled into the next round of rewards.
  4) The reward for the top player is not counted in the 2x release amount.

6. The system code is open source, data is on the chain, decentralized accounting, no backdoor, non-tamperable, automatic operation, automatic distribution.

7. The system discloses the contract rules and the default recommendation code, and players can take the initiative to participate without a recommender.

8. All players of this MPM will receive MIDAFI promotion mining qualifications and MIDAFI platform governance coins. The more you participate, the more you get, the more you promote, the more you get.

9. Contract open source address:
github page :https://github.com/MIDAFITOM/mpm
gitee page: https://gitee.com/midafitom/mpm

10. Contract address: 5uVhXNsdN8TQdZTSeLeCAvCqqBeY6j5E7JrGtcEmf9hAoR1WEY91UriaKGcf1usAtJ32cfvQHG9qVsWt6xDHXULQ`,
        rule1: 'Default referral code: ' + defaultCode
    };


    zh_CN = {
        text: "語言",
        warn: "自由參與 風險自控",
        copySucc: "复制成功",
        copy: "复制",
        button: {
            ok: "确定",
            cancel: "取消"
        },
        switchAccount: {
            title: "切換賬戶",
            message: "确定要切換賬戶吗？",
        },
        more: "更多",
        less: "收起",
        winnerPool: "今日獎勵",
        headerNo: "排名",
        headerPerf: "直推業績",
        headerCode: "編碼",
        background: {
          player: "player_cn",
          heros: "heros_cn"
        },
        topPlayer: '頭號玩家',
        topPlayerYesterday: '昨日頭號玩家',
        picker: {
          select: "切換",
          ok: "确定",
          cancel: "取消"
        },
        mpmAccount: "MPM賬戶",
        quota: "额度不足",
        new:{
            'qbzh': '錢包賬戶',
            'yune': '餘額',
            'ms' : 'SERO',
            'mm' : 'MPM賬戶MIDAFI',
            'ft' : '復投',
            'tq' : '提取',
            'yj' : '預計總收益',
            'sj' : '實際總收益',
            'cf' : '觸發收益',
            'cy' : '參與',
            'zqz': '左區總業績',
            'yqz': '右區總業績',
            'zqf': '左區分享碼',
            'yqf': '右區分享碼',
            'fz' : '複製',
            'gd' : '更多',
            'jrjl': '今日獎勵',
            'zrjl': '昨日獎勵',
            'pm': '排名',
            'zt': '直推業績',
            'bm' : '編碼',
            'thwj': '頭號玩家',
            'zrthwj': '昨日頭號玩家',
            'zrwd': '昨日我的排名',
            'dqjtze': '當前靜態總額',
            'zrjtze': '昨日靜態總額',
            'mrghze': '每日返還總額',
            'hyye': '合約餘額',
            'acye': 'A池餘額',
            'bcye': 'B池餘額',
            'jra' : '進入A池資金',
            'jrb' : '進入B池資金',
            'jrj' : '進入獎池資金率',
            'cfb' : '觸發B池資金率',
            'acr' : 'A池日利率',
            'bcr' : 'B池日利率',
            'fxll': '分享利率',
            'ztll': '直推利率',
            'lpll': '量碰利率',
            'bccf': 'B池是否已觸發',
            'all' :'進入A池,進入B池,A日利,B日利,觸發B池資金率,進入獎池,分享,直推,量碰',
            'sz' : '設置',
            'cr': '存入',
            'tjsy': '預計收益額度',
            'dtjt':'當天靜態收益',
            'dtzt': '當天推薦收益',
            'dtfx':'當天分享收益',
            'dtlp': '當天量碰收益',
            'dtz': '當天總收益',
            'sjjt': '累計靜態收益',
            'ljtj': '累計推薦收益',
            'sjfx':'累計分享收益',
            'sjlp': '累計量碰收益',
            'ljth': '累計頭號玩家收益',
            'zcy': '總參與',
            'zsy': '總收益',
            'tj': '提交',
            'ztm': '直推碼',
            'jdm': '接點碼',
            'SEROsl': 'SERO數量',
            'qx' : '取消',
            'sq' : '收起',
            'tz' : '參與',
            'je' : 'SERO數量',
            'qsr': '請輸入參與SERO數量',
            'qsrj' : '參與數量須大於或等於10SERO',
            'qsrjd' : '請輸入接點碼',
            'qsrzt' : '請輸入直推碼',
            'zycy' : '自由參與 風險自控',

        },
        account: {
            name: "錢包賬戶",
            title: "我的账户",
            change: "切換",
            balance: "SERO",
            token: "MIDAFI",
            invest: "參與",
            withdraw: "提取",
            reinvest: "復投",
            trigger: "触发收益",
            staticReward: "當天靜態收益",
            dynamicReward: "預計當天分享收益",
            dynamicDirectReward: "當天推薦收益",
            collideReward: "預計當天量碰收益",
            dayReward: "預計當天總收益",
            totalStaticReward: "累計靜態收益",
            totalDynamicReward: "累計分享收益",
            totalDynamicDirectReward: "累計推薦收益",
            totalCollideReward: "累計量碰收益",
            totalWinReward: "累計頭號玩家激勵獎",
            totalInvestment: "總參與",
            totalReward: "總收益",
            totalReward2: "實際總收益",
            canWithdraw: "SERO",
            value: "預計總收益",
            rule: "規則",
            tokenInContract: "MIDAFI",

            modal: {
                title: "參與",
                code: "接点码",
                directCode: "直推码",
                lcode: "左区分享码",
                rcode: "右区分享码",
                value: "SERO數量",
                cancel: "取消",
                submit: "提交"
            },
            recommend: {
                title: "我的业绩",
                linvitationCode: "左區分享碼",
                rinvitationCode: "右區分享碼",
                inviteNumber: "直推人数",
                achievement: "直接分享有效业绩",

                level: "层级",
                count: "人数",
                profit: "分享收益",
                lachieveDetail: "左区有效业绩",
                rachieveDetail: "右区有效业绩",
                ltotal: "左區總業績",
                rtotal: "右區總業績",
                state: "状态",
                stateValues: ["可拿", "不可拿"]
            }
        },
        rule:
`MPM所有玩家進來的SERO分配如下：91%進入合約池，3%進入頭號玩家激勵獎池，6%合約支持金融。

合約規則：
1.以推薦碼做為鏈接關係，推薦碼分為直推碼和接點碼
      直推碼：獲取直推獎勵和頭號玩家獎勵
      接點碼：作為上下業績鏈接關係

2.參與範圍：10枚SERO起參與，可無限追加，動靜結合2倍出局。參與數量或累計參與數量達到10萬枚以上SERO獎勵無燒傷。

3.靜態收益
 1)參與後，立即顯示參與數量2倍的靜態收益額度，此額度可無限追加。
 2) 靜態收益以每日收益額度餘量的5‰釋放或以合約池餘量的2%加權分配給每位參與玩家。
 3）MPM設有專屬的市場平衡正弦釋放體系。精密測算市場的參與與釋放間比率，根據市場的參與度，以參與者靜態收益額度餘量的5‰或幣池餘量的2%加權分配兩個模式每日釋放給所有參與玩家，兩種釋放模式交替轉換，從而保證每日SERO的釋放長久、平穩、永不枯竭。
 4) 參與過程中，每天收益可複投增加收益額度。


4.動態收益
 1）直推獎：獲得直推玩家參與數量的10%，有燒傷，參與數量達到10萬枚SERO以上無燒傷。

 2）量碰獎：左區和右區有新增業績即可量碰，計算獎勵以小區新增業績為準。
 A、參與數量的量碰獎勵分配比率
①、10~499枚SERO      量碰4%
②、500~4999枚SERO    量碰6%
③、5000~9999枚SERO   量碰8%
④、10000枚SERO以上    量碰10%
 B、量碰獎勵的數量日封頂額為10萬枚SERO，量碰獎不限代，量碰獎勵最高比率為10% .
 C、量碰獎勵日結，結算時間為12:00 。

 3）分享獎：
  a）累計參與數量分別達到以下級別時,可拿傘下被分享玩家靜態收益的10%，具體可拿代數如下：
①、10~4999枚SERO       拿1代
②、5000~9999枚SERO     拿5代
③、10000~14999枚SERO   拿10代
④、15000~19999枚SERO   拿11代
⑤、累計參與數量達2萬枚SERO，即可永久享有12代被分享玩家靜態收益的10%  .
⑥、累計參與數量達2萬枚SERO基礎上，每增加1萬枚SERO時，即可永久享有新增1代被分享玩家靜態收益的10%，最高可享有20代被分享玩家靜態收益的10 % .    
  b）分享收益有燒傷，即計算分享收益時，按分享玩家與被分享玩家的靜態收益額度較少者計算；參與數量或累計參與數量10萬枚以上無燒傷。
  c）分享收益每日結算，可提現、可複投 。

5.頭號玩家激勵獎
  1）每日直推業績最多者為頭號玩家，可獲得獎勵池數量20%的獎勵。此獎勵日結，每日12:00準時結算。
  2）每日直推業績最多的前六名玩家，實時進入英雄榜，爭奪頭號玩家。
  3）獎勵池剩餘80%滾入下一輪獎勵。
  4）頭號玩家獎勵獎不計算在2倍釋放額度內。

6. 系統代碼開源，數據上鍊，去中心化記賬，沒有後門，不可篡改，自動運行，自動分發。

7.系統公開合約規則及默認推薦碼，玩家可在無推薦人的情況下主動參與。

8.本次MPM的所有玩家，都將獲贈MIDAFI推廣挖礦資格，獲得MIDAFI平台治理幣。參與越多獲得越多，推廣越多獲得越多。

9.合約開源地址：
github page :https://github.com/MIDAFITOM/mpm
gitee page: https://gitee.com/midafitom/mpm

10.合約地址：5uVhXNsdN8TQdZTSeLeCAvCqqBeY6j5E7JrGtcEmf9hAoR1WEY91UriaKGcf1usAtJ32cfvQHG9qVsWt6xDHXULQ`,
        rule1: '默认推荐码：' + defaultCode
    };
};

export const language = new Language();
