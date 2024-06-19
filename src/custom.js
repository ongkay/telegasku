/**
 * Multiplies an input value by 2.
 * @param {number} input The number to double.
 * @return The input multiplied by 2.
 * @customfunction
 */
function DOUBLE(input) {
  return input * 2;
}

/**
 * Multiplies the input value by 2.
 *
 * @param {number|Array<Array<number>>} input The value or range of cells
 *     to multiply.
 * @return The input multiplied by 2 ajaaa.
 * @customfunction
 */
function DOUBLERANGE(input) {
  return Array.isArray(input) ? input.map((row) => row.map((cell) => cell * 2)) : input * 2;
}

/**
 * Calculates the sale price of a value at a given discount.
 * The sale price is formatted as US dollars.
 *
 * @param {number} input The value to discount.
 * @param {number} discount The discount to apply, such as .5 or 50%.
 * @return The sale price formatted as USD.
 * @customfunction
 */
function salePrice(input, discount) {
  let price = input - input * discount;
  let dollarUS = Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  return dollarUS.format(price);
}

/**
 * menghitung pips, hasilnya positif
 *
 * @param {number} priceA harga entry.
 * @param {number} priceB harga SL atau TP
 * @param {string} pair masukkan pair
 * @return nilai pips hasilnya selalu positif
 * @customfunction
 */
function countPips(priceA, priceB, pair = 'XAUUSD') {
  pair = pair.toLowerCase();
  const data = dataPair[pair];

  let points = Math.abs(priceA - priceB) * data.point;

  let pips = points / 10;

  return Math.round(pips * 100) / 100;
}

/**
 * menghitung profit usd dengan hasil pips, hasilnya selalu positif
 *
 * @param {number} pips profit or SL pips
 * @param {number} lotSize lot size nya
 * @param {string} pair masukkan pair
 * @return nilai profit usd
 * @customfunction
 */
function count$(pips, lotSize, pair = 'XAUUSD') {
  pair = pair.toLowerCase();
  const data = dataPair[pair];

  !lotSize ? (lotSize = 0.01) : null;

  let res = pips * lotSize * data.price;
  return Math.round(res * 100) / 100;
}

/**
 * menghitung net pips, net dollar, net RR
 *
 * @param {number} risk risk pips/dollar/rr
 * @param {number} reward reward pips/dollar/rr
 * @param {string} status statusnya
 * @return nilai pips/dollar/rr
 * @customfunction
 */
function countNet(status, risk, reward) {
  if (status.includes('TP')) {
    return reward;
  } else if (status.includes('SL')) {
    return risk;
  } else return 0;
}

/**
 * menghitung net pips, net dollar, net RR
 *
 * @param {number} entryPrice
 * @param {number} sl1
 * @param {number} sl2
 * @param {number} tp1
 * @param {number} tp2
 * @param {number} tp3
 * @param {number} tp4
 * @param {number} tp5
 * @param {number} initialBalance // saldo awal
 * @param {number} exitPrice // cut profit / cut loss
 * @param {number} maxPrice
 * @param {number} ddPrice
 * @param {string} pair
 * @param {string} direction // sell / buy
 * @param {string} status  // TP HIT, TP CLOSE, SL HIT, SL CLOSE, PENDING, RUNNING, BE, MISSED, NOT ACTIVE, BREAKEVEN
 * @param {string} target // TP1, TP2, TP3, TP4, TP5, TP MAX, TPP, R
 * @param {string} setTarget // hanya untuk analisis
 * @param {string} risk // 1%, 2%, 0,01
 * @param {string} setRisk
 * @param {string} setBreakEven // hanya aktive ketika seTarget analisis aja

 * @return all
 * @customfunction
 */
function countAll(
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
  setBreakEven
) {
  const {
    isWin,
    isBreakEven,
    ket,
    lotSize,
    tpPrice,
    slPips,
    slDollar,
    slPersen,
    tpPips,
    tpDollar,
    tpPersen,
    rr,
    netRR,
    netPips,
    netProfit,
    ROI,
    ddPips,
    ddDollar,
    ddPersen,
    ddToSl,
    tpPipsMax,
  } = getCountAll({
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
    initialBalance,
    target,
    setTarget,
    risk,
    setRisk,
    exitPrice,
    maxPrice,
    ddPrice,
    setBreakEven,
  });

  const res = [
    [
      isWin,
      isBreakEven,
      ket,
      lotSize,
      tpPrice,
      slPips,
      slDollar,
      slPersen,
      tpPips,
      tpDollar,
      tpPersen,
      rr,
      netRR,
      netPips,
      netProfit,
      ROI,
      ddPips,
      ddDollar,
      ddPersen,
      ddToSl,
      tpPipsMax,
    ],
  ];

  return res;
}
