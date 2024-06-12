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
