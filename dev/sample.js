function timestampToDateString(timestamp) {
  var date = new Date(timestamp * 1000); // Convert timestamp to milliseconds
  var formattedDate = Utilities.formatDate(date, 'GMT+7', 'dd/MM/yy HH:mm');
  return formattedDate;
}

function testimestampToDateString() {
  var timestamp = 1717188900;
  var formattedDate = timestampToDateString(timestamp);
  console.log('Tanggal:', formattedDate);
}

//==========================================================
function formatDateToIndonesiaLocale(unixTimestamp) {
  var date = new Date(unixTimestamp * 1000); // Konversi timestamp UNIX ke Date object
  var options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    // hour12: true,
    // timeZone: 'Asia/Jakarta' // Waktu lokal Indonesia
  };

  return date.toLocaleDateString('id-ID', options);
}

function tesformatDateToIndonesiaLocale() {
  var unixTimestamp = 1717188900;
  var formattedDate = formatDateToIndonesiaLocale(unixTimestamp);
  console.log('Tanggal yang diformat:', formattedDate);
}
//==========================================================

function getTimeZoneSession(hour) {
  if (hour >= 13.5 && hour < 18.3) {
    return 'London';
  } else if (hour >= 18.3 || hour < 5) {
    return 'New York';
  } else {
    return 'Asia';
  }
}

function tesgetTimeZoneSession() {
  var timezone = getTimeZoneSession(18.3);
  console.log('Sesi waktu:', timezone);
}
//==========================================================
function parseDate(date = null, time = null) {
  const dateInputMentah = 'Date @ 20/05/2024 15:30';
  const dateInput = '20/05/2022 15:30';

  let d = new Date();

  if (date) {
    const dateSplit = date.split(' ');
    let alldate = dateSplit[0].split('/');
    d.setDate(alldate[0]);
    d.setMonth(alldate[1] - 1);
    alldate.length >= 3 ? d.setFullYear(alldate[2]) : null;

    if (dateSplit.length > 1) {
      let allTime = dateSplit[1].split(':');
      d.setHours(allTime[0]);
      d.setMinutes(allTime[1]);
    }
  }

  if (time) {
    let allTime = time.split(':');
    d.setHours(allTime[0]);
    d.setMinutes(allTime[1]);
  }

  return d;
}

function calculateTimeDuration(startDateString, endDateString) {
  // Convert date and time strings to Date objects
  var startDate = new Date(parseDate(startDateString));
  var endDate = new Date(parseDate(endDateString));

  // Calculate the time difference in milliseconds
  var timeDiffInMillis = endDate.getTime() - startDate.getTime();

  // Convert milliseconds to seconds
  var timeDiffInSeconds = timeDiffInMillis / 1000;

  // Calculate the number of days
  var days = Math.floor(timeDiffInSeconds / 86400);

  // Calculate the remaining hours
  var remainingHours = Math.floor((timeDiffInSeconds % 86400) / 3600);

  // Calculate the remaining minutes
  var remainingMinutes = Math.floor((timeDiffInSeconds % 3600) / 60);

  // Format the duration string
  var durationString = days + ' hari ' + remainingHours + ' jam ' + remainingMinutes + ' menit';

  // Return the duration string
  return durationString;
}

function tescalculateTimeDuration() {
  var startDateString = '15/05/2024 15:30';
  var endDateString = '16/05/2024 16:30';

  var durationString = calculateTimeDuration(startDateString, endDateString);
  return 'Durasi: ' + durationString;
}

console.log(tescalculateTimeDuration());

//==========================================================

function calculateRiskRewardCFD(entryPrice, stopLoss, takeProfit, contractSize, lotSize) {
  // Calculate risk in points
  var riskPoints = Math.abs(entryPrice - stopLoss) * contractSize;

  // Calculate risk in pips
  var riskPips = riskPoints / 10; // Assuming 1 point = 0.1 pips

  // Calculate risk in dollars
  var riskDollars = riskPoints * lotSize;

  // Calculate reward in points
  var rewardPoints = Math.abs(entryPrice - takeProfit) * contractSize;

  // Calculate reward in pips
  var rewardPips = rewardPoints / 10; // Assuming 1 point = 0.1 pips

  // Calculate reward in dollars
  var rewardDollars = rewardPoints * lotSize;

  // Return results
  return {
    riskPoints: riskPoints.toFixed(2),
    riskPips: riskPips.toFixed(2),
    riskDollars: riskDollars.toFixed(2),
    rewardPoints: rewardPoints.toFixed(2),
    rewardPips: rewardPips.toFixed(2),
    rewardDollars: rewardDollars.toFixed(2),
  };
}

function tes() {
  // Example usage
  var entryPrice = 1.08002; // Entry price
  var stopLoss = 1.07302; // Stop-loss price
  var takeProfit = 1.09131; // Take-profit price
  var contractSize = 100000; // Contract size
  var lotSize = 0.01; // Lot size

  var riskReward = calculateRiskRewardCFD(entryPrice, stopLoss, takeProfit, contractSize, lotSize);
  console.log(riskReward);
}

//==========================================================
function csvToObject(csv) {
  const lines = csv.trim().split('\n');
  const headers = lines[0].split(',');
  const result = [];

  for (let i = 1; i < lines.length; i++) {
    const obj = {};
    const currentLine = lines[i].split(',');

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j].trim()] = currentLine[j].trim();
    }

    result.push(obj);
  }

  return result;
}

// Contoh penggunaan:
const csvData = `time,open,high,low,close
1710108000,2179.105,2179.905,2179.105,2179.905
1710108300,2179.905,2181.090,2179.635,2180.975
1710108600,2180.975,2181.045,2179.725,2179.740
1710108900,2179.740,2180.250,2179.445,2180.090
1710109200,2180.090,2180.150,2179.730,2179.730`;

const jsonObject = csvToObject(csvData);
console.log(jsonObject);

//==========================================================
