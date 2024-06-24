function analyzeTrade(trade, data) {
  const result = {
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
    drawdownPrice: trade.entry,
    maximumPrice: 0,
    dateCloseMax: null,
  };

  const rr1 = trade.entry + (trade.entry - trade.SL);
  const rr2 = trade.entry + 2 * (trade.entry - trade.SL);
  const rr3 = trade.entry + 3 * (trade.entry - trade.SL);
  const rr4 = trade.entry + 4 * (trade.entry - trade.SL);
  const rr5 = trade.entry + 5 * (trade.entry - trade.SL);

  let maxPrice = trade.entry;
  let drawdownPrice = trade.entry;

  const dateOpen = new Date(trade.dateOpen);

  for (const row of data) {
    const time = new Date(row.time * 1000);
    if (time < dateOpen) continue;

    const high = row.high;
    const low = row.low;
    const close = row.close;

    if (low <= trade.SL) {
      result.isLose = true;
      break;
    }

    if (high >= trade.TP1 && !result.winTP1) {
      result.winTP1 = true;
      result.breakevenAftarTP1 = close <= trade.entry;
    }

    if (high >= trade.TP2 && !result.winTP2) {
      result.winTP2 = true;
      result.breakevenAftarTP2 = close <= trade.entry;
    }

    if (high >= trade.TP3 && !result.winTP3) {
      result.winTP3 = true;
    }

    if (trade.TP4 && high >= trade.TP4 && !result.winTP4) {
      result.winTP4 = true;
    }

    if (trade.TP5 && high >= trade.TP5 && !result.winTP5) {
      result.winTP5 = true;
    }

    if (high >= rr1 && !result.breakevenAftar1R) {
      result.breakevenAftar1R = close <= trade.entry;
    }

    if (high >= rr2 && !result.breakevenAftar2R) {
      result.breakevenAftar2R = close <= trade.entry;
    }

    if (high >= rr3 && !result.breakevenAftar3R) {
      result.breakevenAftar3R = close <= trade.entry;
    }

    if (high >= rr4 && !result.breakevenAftar4R) {
      result.breakevenAftar4R = close <= trade.entry;
    }

    if (high >= rr5 && !result.breakevenAftar5R) {
      result.breakevenAftar5R = close <= trade.entry;
    }

    if (low < drawdownPrice) {
      drawdownPrice = low;
    }

    if (high > maxPrice) {
      maxPrice = high;
      result.maximumPrice = high;
      result.dateCloseMax = time;
    }
  }

  if (!result.winTP1) {
    result.maximumPrice = 0;
    result.dateCloseMax = null;
  }

  result.drawdownPrice = drawdownPrice;

  if (result.dateCloseMax) {
    result.dateCloseMax = result.dateCloseMax.toISOString().replace('T', ' ').substr(0, 16);
  }

  return result;
}

// Example usage:
const trade = {
  id: 1,
  direction: 'BUY NOW',
  dateOpen: '05/06/2024 00:35',
  entry: 2329.904,
  SL: 2318.263,
  TP1: 2351.57,
  TP2: 2373.128,
  TP3: 2380.077,
  TP4: 2396.825,
  TP5: null,
};

const data = [
  { time: 1713270000, open: 2373.045, high: 2373.345, low: 2368.51, close: 2369.315 },
  { time: 1713270300, open: 2369.315, high: 2372.46, low: 2369.215, close: 2371.855 },
  { time: 1713270600, open: 2371.855, high: 2374.865, low: 2371.07, close: 2373.24 },
  // Tambahkan data lebih lanjut di sini
];

console.log(analyzeTrade(trade, data));
