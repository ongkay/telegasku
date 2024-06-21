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

function getRR(risk1, reward, risk2 = null, riskExit) {
  let risk = 1;
  let riskDua = riskExit ?? risk2;

  if (risk2 || riskExit) {
    let riskPlus = riskDua / risk1;
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

function getCountLot(risk, entry, sl, pair, initialBalance) {
  risk = risk.toString();

  let slPips1 = getCountPips(entry, sl, pair);
  let isPersen = risk.includes('%');
  risk = isPersen ? parseFloat(risk.replace('%', '')) : parseFloat(risk);

  if (isPersen) {
    let persenToDollar = (initialBalance * risk) / 100;
    const pipsValue = dataPair[pair].price;
    let persenToLot = Math.round((persenToDollar / slPips1 / pipsValue) * 100) / 100;

    return persenToLot == 0 ? 0.01 : persenToLot;
  } else {
    return risk;
  }
}

function getCountAll({
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
  status,
  initialBalance = 1000,
  target = 'TP1',
  setTarget = 'Original',
  risk = '1%',
  setRisk = 'Original',
  exitPrice,
  maxPrice,
  ddPrice,
  setBreakEven,
}) {
  target ? target.toUpperCase() : '';
  status ? status.toUpperCase() : '';
  let isBuy = direction.includes('BUY');
  let isWin;
  let ket;

  // seting TP Price
  let tpPrice = 0;
  const isTargetOri = setTarget.toUpperCase().includes('ORI');
  const gapPrice = isBuy ? entryPrice - sl1 : sl1 - entryPrice;
  let tragets = isTargetOri ? target : setTarget; // analysis

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
  } else if (tragets.includes('EXIT') && exitPrice) {
    tpPrice = exitPrice;
  }

  let priceBE = null;
  setBreakEven = setBreakEven.toUpperCase();
  if (setBreakEven && !isTargetOri) {
    if (setBreakEven.includes('TP1')) {
      priceBE = tp1;
    } else if (setBreakEven.includes('TP2')) {
      priceBE = tp2;
    } else if (setBreakEven.includes('TP3')) {
      priceBE = tp3;
    } else if (setBreakEven.includes('R')) {
      const setR = setBreakEven.split('R')[0];
      priceBE = isBuy ? entryPrice + gapPrice * setR : entryPrice - gapPrice * setR;
      console.log(setR);
    }
  }

  let isBreakEven = false;
  if (tpPrice && maxPrice) {
    if (isBuy && maxPrice > entryPrice && maxPrice >= tpPrice) {
      isWin = true;
    } else if (!isBuy && maxPrice < entryPrice && maxPrice <= tpPrice) {
      isWin = true;
    } else if (isBuy && priceBE && maxPrice >= priceBE) {
      isWin = false;
      isBreakEven = true;
    } else if (!isBuy && priceBE && maxPrice <= priceBE) {
      isWin = false;
      isBreakEven = true;
    } else {
      isWin = false;
    }
  }

  if (isTargetOri) {
    if (status.includes('TP') && !maxPrice) {
      isWin = true;
    } else if (status.includes('SL') && !maxPrice) {
      isWin = false;
    } else if (status.includes('BREAKEVEN') && !priceBE) {
      isWin = false;
      isBreakEven = true;
    }
  }

  let slExitPrice = null;
  if (exitPrice && isTargetOri) {
    if (isBuy && exitPrice > entryPrice) {
      isWin = true;
      tpPrice = exitPrice;
    } else if (!isBuy && exitPrice < entryPrice) {
      isWin = true;
      tpPrice = exitPrice;
    } else {
      isWin = false;
      slExitPrice = exitPrice;
    }
  }

  // pips
  let slPips1 = getCountPips(entryPrice, sl1, pair);
  let slPips2 = sl2 ? getCountPips(entryPrice, sl2, pair) : null;
  let slExitPips = slExitPrice ? getCountPips(entryPrice, slExitPrice, pair) : null;
  const slPips = slExitPips ?? slPips2 ?? slPips1;

  const tpPips = tpPrice ? getCountPips(entryPrice, tpPrice, pair) : 0;
  const tpPipsMax = maxPrice ? getCountPips(entryPrice, maxPrice, pair) : 0;

  const ddPips = ddPrice ? getCountPips(entryPrice, ddPrice, pair) : 0;
  const ddToSl = ddPrice ? Math.round((ddPips / slPips) * 100) / 100 : 0;

  //risk lot size
  risk = setRisk.toUpperCase().includes('ORI') ? risk : setRisk; // analysis
  let lotSize = getCountLot(risk, entryPrice, sl1, pair, initialBalance);

  //dollar
  const tpDollar = getCountProfit(tpPips, lotSize, pair);
  const slDollar = getCountProfit(slPips, lotSize, pair);
  const ddDollar = getCountProfit(ddPips, lotSize, pair);

  //ROI
  const slPersen = Math.round((slDollar / initialBalance) * 10000) / 10000;
  const tpPersen = Math.round((tpDollar / initialBalance) * 10000) / 10000;
  const ddPersen = Math.round((ddDollar / initialBalance) * 10000) / 10000;

  // RR
  const rr = getRR(slPips1, tpPips, slPips2, slExitPips);
  let myRisk = parseFloat(rr.split(':')[0]);
  let myReward = parseFloat(rr.split(':')[1]);

  // net
  const netRR = isBreakEven ? 0 : isWin ? myReward : isWin == false ? myRisk * -1 : 0;
  const netPips = isBreakEven ? 0 : isWin ? tpPips : isWin == false ? slPips * -1 : 0;
  const netProfit = isBreakEven ? 0 : isWin ? tpDollar : isWin == false ? slPips * -1 : 0;
  const ROI = isBreakEven ? 0 : isWin ? tpPersen : isWin == false ? slPersen * -1 : 0;

  //ket
  ket = !tpPrice
    ? 'Not Found'
    : isBreakEven
    ? 'BE'
    : isWin
    ? `WIN ${myReward}R`
    : isWin == false
    ? `LOSS ${myRisk}R`
    : status;

  const res = {
    isWin,
    isBreakEven,
    lotSize,
    tpPrice,
    slPips,
    slDollar,
    slPersen,
    tpPips,
    tpDollar,
    tpPersen,
    rr,
    tpPipsMax,
    ddPips,
    ddDollar,
    ddPersen,
    ddToSl,
    ket,
    netRR,
    netPips,
    netProfit,
    ROI,
  };

  return res;
}
