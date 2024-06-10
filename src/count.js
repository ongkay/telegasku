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

function getCountProfit(pips, lotSize = 0.01, pair = 'XAUUSD') {
  pair = pair.toLowerCase();
  const data = dataPair[pair];
  let res = pips * lotSize * data.price;
  return Math.round(res * 100) / 100;
}

function getRR(risk1, reward, risk2 = null) {
  let risk = 1;

  if (risk2) {
    let riskPlus = risk2 / risk1;
    risk = Math.abs(riskPlus);
  }
  let r = Math.round(Math.abs(reward / risk1) * 10) / 10;
  return `${risk}:${r}`;
}
