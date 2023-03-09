const zh_HK = {
  rules: {
    title: "規則",
    content1:
      `玩家進入 Midafi Staking 可以進行Midafi質押挖礦。Midafi礦總儲量為115.5萬枚，占Midafi總發行量的55％，挖礦年限100年。

合約規則:
 1、Midafi質押挖礦可以隨押隨取，挖礦產出亦可隨時提取。

2、質押Midafi時須同時有壹定數量Sero的能量配比質押方被視為有效質押，每日中午12點結算，結算時按貭押Midafi : Sero(10:1)比例消耗Sero。

3、Midafi質押挖礦算力聯動MPM合約，MPM玩家參加挖礦有算力加成。
(1)、單純Midafi質押挖礦參與者算力為100％；
(2)、MPM玩家總參與Sero數量為10~4999的，算力值110%；
(3)、MPM玩家總參與Sero數量5000~9999的，算力值120%；
(4)、MPM玩家總參與Sero數量10000-49999的，算力值130%；
(5)、MPM玩家總參與Sero數量50000~99999的，算力值140%；
(6)、MPM玩家總參與Sero數量100000以上算力值150%。

4、挖礦產出Midafi所消耗Sero能量分配如下:
50% MPM聯動百年分紅
20% 社區建設
20％回購Midafi消毀
5%研發中心
5%技術中心

5、MPM聯動百年分紅是壹項向MPM玩家致敬的福利，MPM玩家參與質押挖礦可以根據自身MPM賬號聯動參與百年分紅。參與者須根據MPM聯動賬號Sero總參與量按100:1比例(總參與量 : 質押量)質押Midafi，方可獲取Sero百年分紅。自由參與，無損分紅，隨押隨取。
例: 
MPM Sero總參與10000，最大可質押    100MIDAFI參與分紅

每日中午12點結算分紅。分紅按質押MIDAFI數量權重平均分配。

6、社區建設由Midafi Dao組織自治，參與玩家可進入Midafi Dao板塊。

7.、系統代碼開源，數據上鏈，去中心化記賬，沒有後門，不可篡改，自動運行，自動分發。

8、系統公開合約規則，玩家可在無推薦人的情況下主動參與。

9、合約開源地址： GitHub page :`,
    content2: `

 Gitee page: `,
    content3: `

Netlify page: `,
    content4: `
10、合約地址：`,
  },
  language: "語言",
  wallet: "錢包帳戶",
  changeToWallet: "切換到 ",
  changeToLang: "Switch to ",
  tip: {
    addrCopied: '地址已複製',
  },
  text: {
    staking: '質押數量',
    gas: '收益燃料',
    apy: '實時年化',
    computingPower: '聯動算力',
    centennialDividend: '百年分紅',
  },
  input: {
    prompt1: 'MPM參與額度',
    prompt2: '百年分紅總額度',
    prompt3: '已使用額度',
    prompt4: '剩餘額度',
    promptWithdrawInterest: '您可以提現的數量(單位MIDAFI)',
    promptReinvest: '您可以復投的數量(單位MIDAFI)',
    promptDepositMidafi: '請輸入數量(單位MIDAFI)',
    promptWithdrawSero: '請輸入數量(單位SERO)',
  },
  button: {
    ok: '確認',
  },
  imageLocation: 'cn',
  riskWarning: '自由參與 風險自控',
  changeWallet: {
    title: '切換賬戶',
    content: '確定要切換賬戶嗎？',
    ok: '確定'
  },
}
export default zh_HK;