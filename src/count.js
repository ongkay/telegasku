const dataPair = {
  xauusd: {
    point: 100,
    price: 10,
    majorPair: true,
  },
  usdjpy: {
    point: 10000,
    price: 10,
    majorPair: true,
  },
  gbpjpy: {
    point: 100,
    price: 20,
    majorPair: true,
  },
};

// oil, indexs, crypto, all forex,
const dataPairs = [
  {
    name: 'XAUUSD',
    point: 100,
    pipsValue: 10,
    majorPair: true,
    type: ['TF Pair', 'Major Pair', 'metal'],
  },
  {
    name: 'XAUUSD',
    point: 100,
    pipsValue: 10,
    majorPair: true,
    type: ['TF Pair', 'Major Pair', 'Forex'],
  },
];

function getCountPips(priceA, priceB, pair = 'XAUUSD') {
  pair = pair.toLowerCase();
  const data = dataPair[pair];

  let points = Math.abs(priceA - priceB) * data.point;

  let pips = points / 10;

  return Math.round(pips * 100) / 100;
}

function getRR(risk1, reward, risk2 = null) {
  let risk = 1;

  if (risk2) {
    let riskPlus = risk2 / risk1;
    risk = Math.round(Math.abs(riskPlus) * 10) / 10;
  }
  let r = Math.round(Math.abs(reward / risk1) * 10) / 10;
  return `${risk}:${r}`;
}

function getCountProfit(pips, lotSize, pair = 'XAUUSD') {
  pair = pair.toLowerCase();
  const data = dataPair[pair];

  !lotSize ? (lotSize = 0.01) : null;

  let res = pips * lotSize * data.price;
  return Math.round(res * 100) / 100;
}

function getCountDollars(entry, tpOrSl, pair = 'XAUUSD', lotSize) {
  pair = pair.toLowerCase();
  let pips = getCountPips(entry, tpOrSl, pair);

  !lotSize ? (lotSize = 0.01) : null;

  const data = dataPair[pair];
  let res = pips * lotSize * data.price;
  return Math.round(res * 100) / 100;
}

function counting(pair, entry, sl, tp, lotSize, sl2, status, initialBalance = 1000, exitPrice, maxPrice, ddPrice) {
  let isWin = status.includes('TP');
  let isLose = status.includes('SL');
  console.log(isWin);
  console.log(isLose);

  // pips
  let slPips1 = sl ? getCountPips(entry, sl, pair) * -1 : null;
  let slPips2 = sl2 ? getCountPips(entry, sl2, pair) * -1 : null;
  const tpPips = tp ? getCountPips(entry, tp, pair) : null;
  const slPips = slPips2 ?? slPips1;
  console.log({ slPips });

  //dollar
  const tpDollar = getCountProfit(tpPips, lotSize, pair);
  const slDollar = getCountProfit(slPips, lotSize, pair);

  //ROI
  const slPersen = Math.round((slDollar / initialBalance) * 10000) / 10000;
  const tpPersen = Math.round((tpDollar / initialBalance) * 10000) / 10000;

  // RR
  const rr = getRR(slPips1 * -1, tpPips, slPips2 * -1);
  let risk = rr.split(':')[0] * -1;
  let reward = rr.split(':')[1];

  // net
  const netRR = isWin ? reward : isLose ? risk : 0;
  const netPips = isWin ? tpPips : isLose ? slPips : 0;
  const netProfit = isWin ? tpDollar : isLose ? slPips : 0;
  const ROI = isWin ? tpPersen : isLose ? slPersen : 0;

  // return
  // const res = [[slPips, tpPips, slDollar, tpDollar, rr, netRR, netPips, netProfit, ROI]];
  const res = { slPips, tpPips, slDollar, tpDollar, rr, netRR, netPips, netProfit, ROI };

  return res;
}

function getAlltWinLose({ pair, entry, sl, tp1, tp2, tp3, tp4, tp5, lotSize, sl2 }) {
  const res = {};
  const resFormat = {
    pipsSl: null,
    pipsSl2: null,
    pipsTp1: null,
    pipsTp2: null,
    pipsTp3: null,
    pipsTp4: null,
    pipsTp5: null,
    dollarSl: null,
    dollarSl2: null,
    dollarTp1: null,
    dollarTp2: null,
    dollarTp3: null,
    dollarTp4: null,
    dollarTp5: null,
    rrTp1: null,
    rrTp2: null,
    rrTp3: null,
    rrTp4: null,
    rrTp5: null,
  };

  // pips
  sl ? (res.pipsSl = getCountPips(entry, sl, pair)) : null;
  sl2 ? (res.pipsSl2 = getCountPips(entry, sl2, pair)) : null;
  tp1 ? (res.pipsTp1 = getCountPips(entry, tp1, pair)) : null;
  tp2 ? (res.pipsTp2 = getCountPips(entry, tp2, pair)) : null;
  tp3 ? (res.pipsTp3 = getCountPips(entry, tp3, pair)) : null;
  tp4 ? (res.pipsTp4 = getCountPips(entry, tp4, pair)) : null;
  tp5 ? (res.pipsTp5 = getCountPips(entry, tp5, pair)) : null;

  //dollar
  sl ? (res.dollarSl = getCountDollars(entry, sl, pair, lotSize)) : null;
  sl2 ? (res.dollarSl2 = getCountDollars(entry, sl2, pair, lotSize)) : null;
  tp1 ? (res.dollarTp1 = getCountDollars(entry, tp1, pair, lotSize)) : null;
  tp2 ? (res.dollarTp2 = getCountDollars(entry, tp2, pair, lotSize)) : null;
  tp3 ? (res.dollarTp3 = getCountDollars(entry, tp3, pair, lotSize)) : null;
  tp4 ? (res.dollarTp4 = getCountDollars(entry, tp4, pair, lotSize)) : null;
  tp5 ? (res.dollarTp5 = getCountDollars(entry, tp5, pair, lotSize)) : null;

  // RR
  res.pipsTp1 ? (res.rrTp1 = getRR(res.pipsSl, res.pipsTp1, res.pipsSl2)) : null;
  res.pipsTp2 ? (res.rrTp2 = getRR(res.pipsSl, res.pipsTp2, res.pipsSl2)) : null;
  res.pipsTp3 ? (res.rrTp3 = getRR(res.pipsSl, res.pipsTp3, res.pipsSl2)) : null;
  res.pipsTp4 ? (res.rrTp4 = getRR(res.pipsSl, res.pipsTp4, res.pipsSl2)) : null;
  res.pipsTp5 ? (res.rrTp5 = getRR(res.pipsSl, res.pipsTp5, res.pipsSl2)) : null;

  return res;
}

function countingBP({
  pair,
  direction,
  entryPrice,
  sl1,
  sl2,
  tp1,
  tp2,
  tp3,
  tp4,
  tp5,
  tpp,
  lotSize,
  statusnya,
  initialBalance = 1000,
  target = 'TP1',
  exitPrice,
  maxPrice,
  ddPrice,
  setTarget = 'Original',
  risk,
  setRisk = 'Original',
}) {
  target ? target.toUpperCase() : '';
  let isBuy = direction.includes('BUY');
  let isSell = direction.includes('SELL');
  // let isWin = status.includes('TP');
  // let isLose = status.includes('SL');
  let isWin;

  // seting TP Price
  let tpPrice = 0;
  const gapPrice = isBuy ? entryPrice - sl1 : sl1 - entryPrice;
  let tragets = setTarget.toUpperCase().includes('ORI') ? target : setTarget; // analysis

  if (tragets.includes('TP1') && tp1) {
    tpPrice = tp1;
  } else if (tragets.includes('TP2') && tp2) {
    tpPrice = tp2;
  } else if (tragets.includes('TP3') && tp3) {
    tpPrice = tp3;
  } else if (tragets.includes('TP4') && tp4) {
    tpPrice = tp4;
  } else if (tragets.includes('TP5') && tp5) {
    tpPrice = tp5;
  } else if (tragets.includes('R')) {
    const targetNumber = tragets.split('R')[0];
    tpPrice = isBuy ? entryPrice + gapPrice * targetNumber : entryPrice - gapPrice * targetNumber;
  } else if (tragets.includes('MAX') && maxPrice) {
    tpPrice = maxPrice;
  } else if (tragets.includes('TPP') && tpp) {
    tpPrice = tpp;
  }

  if (maxPrice) {
    if (isBuy) {
      maxPrice > entryPrice ? (isWin = true) : (isWin = false);
    } else {
      maxPrice < entryPrice ? (isWin = true) : (isWin = false);
    }
  }

  // pips
  let slPips1 = getCountPips(entryPrice, sl1, pair) * -1;
  let slPips2 = sl2 ? getCountPips(entryPrice, sl2, pair) * -1 : null;
  const tpPips = tpPrice ? getCountPips(entryPrice, tpPrice, pair) : 0;
  const slPips = slPips2 ?? slPips1;

  //risk lot size
  let lots = setRisk.toUpperCase().includes('ORI') ? risk : setRisk; // analysis
  let resiko = (initialBalance * Number(lots)) / 100;

  //dollar
  const tpDollar = getCountProfit(tpPips, lotSize, pair);
  const slDollar = getCountProfit(slPips, lotSize, pair);

  //ROI
  const slPersen = Math.round((slDollar / initialBalance) * 10000) / 10000;
  const tpPersen = Math.round((tpDollar / initialBalance) * 10000) / 10000;

  // RR
  const rr = getRR(slPips1 * -1, tpPips, slPips2 * -1);
  let myRisk = rr.split(':')[0] * -1;
  let myReward = rr.split(':')[1];

  // net
  const netRR = isWin ? myReward : isLose ? myRisk : 0;
  const netPips = isWin ? tpPips : isLose ? slPips : 0;
  const netProfit = isWin ? tpDollar : isLose ? slPips : 0;
  const ROI = isWin ? tpPersen : isLose ? slPersen : 0;

  // return
  // const res = [[slPips, tpPips, slDollar, tpDollar, rr, netRR, netPips, netProfit, ROI]];
  const res = { tpPrice, slPips, tpPips, slDollar, tpDollar, slPersen, tpPersen, rr, netRR, netPips, netProfit, ROI };

  return res;
}
