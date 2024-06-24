function analyzeTrade(trade, data) {
  const entry = trade.entry;
  const sl = trade.SL;
  const tp1 = trade.TP1;
  const tp2 = trade.TP2;
  const tp3 = trade.TP3;
  const tp4 = trade.TP4;
  const tp5 = trade.TP5;
  const dateOpen = new Date(trade.dateOpen);
  const tradeTimeUnix = Math.floor(dateOpen.getTime() / 1000);

  const tradeData = data.filter((row) => row.time >= tradeTimeUnix);

  let result = {
    id: trade.id,
    notActive: false,
    winTP1: false,
    winTP2: false,
    winTP3: false,
    winTP4: false,
    winTP5: false,
    breakevenAftarTP1: false,
    breakevenAftarTP2: false,
    breakevenAftar1R: false,
    breakevenAftar2R: false,
    breakevenAftar3R: false,
    breakevenAftar4R: false,
    breakevenAftar5R: false,
    isLose: false,
    drawdownPrice: null,
    maximumPrice: null,
    dateCloseMax: null,
  };

  if (trade.direction === 'BUY NOW') {
    for (let i = 0; i < tradeData.length; i++) {
      const row = tradeData[i];
      if (row.low <= sl) {
        result.isLose = true;
        result.drawdownPrice = row.low;
        break;
      }
      if (!result.winTP1 && row.high >= tp1) {
        result.winTP1 = true;
        result.maximumPrice = row.high;
        result.dateCloseMax = new Date(row.time * 1000).toISOString().replace('T', ' ').substr(0, 16);
      }
      if (result.winTP1 && row.low <= entry) {
        result.breakevenAftarTP1 = true;
      }
      if (!result.winTP2 && row.high >= tp2) {
        result.winTP2 = true;
      }
      if (result.winTP2 && row.low <= entry) {
        result.breakevenAftarTP2 = true;
      }
      if (!result.winTP3 && row.high >= tp3) {
        result.winTP3 = true;
      }
      if (result.winTP3 && row.low <= entry) {
        result.breakevenAftar1R = true;
      }
    }
  } else if (trade.direction === 'SELL NOW') {
    for (let i = 0; i < tradeData.length; i++) {
      const row = tradeData[i];
      if (row.high >= sl) {
        result.isLose = true;
        result.drawdownPrice = row.high;
        break;
      }
      if (!result.winTP1 && row.low <= tp1) {
        result.winTP1 = true;
        result.maximumPrice = row.low;
        result.dateCloseMax = new Date(row.time * 1000).toISOString().replace('T', ' ').substr(0, 16);
      }
      if (result.winTP1 && row.high >= entry) {
        result.breakevenAftarTP1 = true;
      }
      if (!result.winTP2 && row.low <= tp2) {
        result.winTP2 = true;
      }
      if (result.winTP2 && row.high >= entry) {
        result.breakevenAftarTP2 = true;
      }
      if (!result.winTP3 && row.low <= tp3) {
        result.winTP3 = true;
      }
      if (result.winTP3 && row.high >= entry) {
        result.breakevenAftar1R = true;
      }
    }
  }

  if (trade.direction === 'BUY LIMIT' || trade.direction === 'SELL LIMIT') {
    if (!(result.winTP1 || result.winTP2 || result.winTP3 || result.winTP4 || result.winTP5)) {
      result.notActive = true;
    }
  }

  return result;
}

// Example usage with mock data
const trade = {
  id: 10104572,
  direction: 'BUY LIMIT',
  dateOpen: '27/03/2024 08:45',
  entry: 2176.265,
  SL: 2171.086,
  TP1: 2181.652,
  TP2: 2188.993,
  TP3: 2196.276,
  TP4: 2209.015,
  TP5: null,
};

// Mock trade data (replace this with actual data)
const data = [
  // Add data entries here, e.g.
  { time: 1711507500, open: 2170, high: 2185, low: 2160, close: 2175 },
  // More data entries...
];

const result = analyzeTrade(trade, data);
console.log(JSON.stringify(result, null, 2));
