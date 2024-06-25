// Fungsi untuk menganalisis data harga
function analyzeTrade(data, entryPrice, stopLoss, targetProfit) {
  let maxDrawdown = 0;
  let currentMax = entryPrice;
  let hitStopLoss = false;
  let hitTargetProfit = false;
  let finalStatus = 'Neither Stop Loss nor Target Profit was hit';

  for (let i = 0; i < data.length; i++) {
    let row = data[i];
    let high = row.high;
    let low = row.low;

    // Hitung drawdown
    let drawdown = (currentMax - low) / currentMax;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }

    // Update current max price
    if (high > currentMax) {
      currentMax = high;
    }

    // Cek stop loss dan target profit
    if (low <= stopLoss) {
      hitStopLoss = true;
      finalStatus = 'Hit Stop Loss';
      break;
    }
    if (high >= targetProfit) {
      hitTargetProfit = true;
      finalStatus = 'Hit Target Profit';
      break;
    }
  }

  return {
    reachedStopLoss: hitStopLoss,
    reachedTargetProfit: hitTargetProfit,
    finalStatus: finalStatus,
    maximumDrawdown: maxDrawdown,
  };
}

// Contoh penggunaan fungsi
// Data harga (time, open, high, low, close)
const priceData = [
  { time: '2024-06-20T12:10:00Z', open: 2339.61, high: 2340.0, low: 2338.0, close: 2339.5 },
  { time: '2024-06-20T12:15:00Z', open: 2339.5, high: 2341.0, low: 2337.0, close: 2340.5 },
  // Tambahkan lebih banyak data sesuai kebutuhan...
];

// Parameter entry
const entryPrice = 2339.61;
const stopLoss = 2333.009;
const targetProfit = 2359.346;

// Panggil fungsi analisis
const result = analyzeTrade(priceData, entryPrice, stopLoss, targetProfit);

// Cetak hasil
console.log(result);
