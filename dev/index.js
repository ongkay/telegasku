function parseDate(date = null, time = null) {
  const dateInputMentah = 'Date @ 20/05/2024 15:30';
  // const dateInput = '20/05/2022 15:30';
  const dateInput = '20/05/2022';

  let d = new Date();

  if (date) {
    const dateSplit = date.split(' ');

    let alldate = dateSplit[0].split('/');
    d.setDate(alldate[0]);
    d.setMonth(alldate[1] - 1);
    alldate.length >= 3 ? d.setFullYear(alldate[2]) : null;

    let jam = dateSplit[1];

    if (dateSplit.length > 1 && jam !== '') {
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

  return d; // '2024-03-22T09:56:52.000Z'
}

function getTimstampToTgl(timestamp) {
  var timestamp = parseInt(timestamp, 10) * 1000;
  const date = new Date(timestamp);

  // Mengambil bagian-bagian tanggal dan waktu
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Bulan dimulai dari 0
  // const year = String(date.getFullYear()).slice(-2); // Mengambil dua digit terakhir tahun
  const year = String(date.getFullYear());

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  // Menggabungkan bagian-bagian tersebut ke dalam format 'dd/MM/yy HH:mm'
  const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;

  return formattedDate; //'24/06/2024 17:50' '1719226200'
}

function getRrPrice(isBuy, entryPrice, SlPrice, targetR) {
  const gapPrice = isBuy ? entryPrice - SlPrice : SlPrice - entryPrice;
  return isBuy ? entryPrice + gapPrice * targetR : entryPrice - gapPrice * targetR;
}

function analyzeTrade(trade, data) {
  const direction = trade.direction;
  const entry = trade.entry;
  const sl = trade.SL;
  const tp1 = trade.TP1;
  const tp2 = trade.TP2;
  const tp3 = trade.TP3;
  const tp4 = trade.TP4;
  const tp5 = trade.TP5;

  const isBuy = direction.includes('BUY') ? true : false;

  const tp20r = getRrPrice(isBuy, entry, sl, 20);

  const dateOpen = new Date(parseDate(trade.dateOpen));
  const tradeTimeUnix = Math.floor(dateOpen.getTime() / 1000);

  const tradeData = data.filter((row) => row.time >= tradeTimeUnix);
  console.log('data trade ada ' + tradeData.length);

  let targetTp = [];
  let res = {
    id: trade.id,
    notActive: false,
    maxPrice: null,
    ddMaxPrice: null,
    dateCloseMax: null,
    targetTp,
  };

  let isRunningProfit = true;
  let maxPrice = entry;
  let currentDdPrice = entry;
  let ddMaxPrice = 0;
  let tpPrice = tp1;
  let hitTp1 = false;
  let hitTp2 = false;
  let hitTp3 = false;
  let hitTp4 = false;
  let hitTp5 = false;
  let isHitSL = false;

  for (let i = 0; i < tradeData.length; i++) {
    const row = tradeData[i];

    const highPrice = parseFloat(row.high);
    const lowPrice = parseFloat(row.low);
    const closePrice = parseFloat(row.close);
    const openPrice = parseFloat(row.open);

    // for stop eksekusi
    if (isBuy && lowPrice <= sl) {
      isHitSL = true;
      break;
    } else if (!isBuy && highPrice >= sl) {
      isHitSL = true;
      break;
    } else if (isBuy && maxPrice >= tp20r) {
      break;
    } else if (!isBuy && maxPrice <= tp20r) {
      break;
    }

    // save maxprice
    if (isBuy && highPrice > maxPrice) {
      maxPrice = highPrice;
      res.maxPrice = highPrice;
      res.dateCloseMax = getTimstampToTgl(row.time);
    } else if (!isBuy && lowPrice < maxPrice) {
      maxPrice = lowPrice;
      res.maxPrice = lowPrice;
      res.dateCloseMax = getTimstampToTgl(row.time);
    }

    // cek runing profit
    if (isBuy && lowPrice > entry) {
      isRunningProfit = true;
    } else if (!isBuy && highPrice < entry) {
      isRunningProfit = true;
    }

    // save dd price in running profit
    if (!isRunningProfit) {
      if (isBuy && lowPrice < currentDdPrice) {
        currentDdPrice = lowPrice;
      } else if (!isBuy && highPrice > currentDdPrice) {
        currentDdPrice = highPrice;
      }
    } else {
      if (isBuy && currentDdPrice < ddMaxPrice) {
        ddMaxPrice = currentDdPrice == entry ? 0 : currentDdPrice;
        res.ddMaxPrice = ddMaxPrice;
      } else if (!isBuy && currentDdPrice > ddMaxPrice) {
        ddMaxPrice = currentDdPrice == entry ? 0 : currentDdPrice;
        res.ddMaxPrice = ddMaxPrice;
      }
    }

    // save array TP
    const pushTp = () => {
      let saveData = {
        price: tpPrice,
        hit: true,
        ddPrice: ddMaxPrice,
        dateClose: getTimstampToTgl(row.time),
        hitToBE: false,
      };
      targetTp.push(saveData);
    };

    const isHit = isBuy ? highPrice >= tpPrice : lowPrice <= tpPrice;
    const isBE = isBuy ? lowPrice <= entry : highPrice >= entry;

    // cek TP
    if (!hitTp1 && isHit) {
      pushTp();
      hitTp1 = true;
      tpPrice = tp2;
    } else if (!hitTp2 && isHit) {
      pushTp();
      hitTp2 = true;
      tpPrice = tp3;
    } else if (!hitTp3 && isHit) {
      pushTp();
      hitTp3 = true;
      tpPrice = tp4;
    } else if (!hitTp4 && isHit) {
      pushTp();
      hitTp4 = true;
      tpPrice = tp5;
    } else if (!hitTp5 && isHit) {
      pushTp();
      hitTp5 = true;
      tpPrice = tp5;
    }

    // cek BE setelah tercapai TP
    if (hitTp1 && !hitTp2 && isBE) {
      targetTp[0].hitToBE = true;
    } else if (hitTp2 && !hitTp3 && isBE) {
      targetTp[1].hitToBE = true;
    } else if (hitTp3 && !hitTp4 && isBE) {
      targetTp[2].hitToBE = true;
    }
  }
  return res;
}

//=====================================================================

// Mock trade data (replace this with actual data)
const data = [
  {
    time: '1719197400',
    open: '2324.18',
    high: '2325.135',
    low: '2323.685',
    close: '2324.735',
  },
  {
    time: '1719197700',
    open: '2324.735',
    high: '2325.015',
    low: '2324.245',
    close: '2324.885',
  },
  {
    time: '1719198000',
    open: '2324.885',
    high: '2325.93',
    low: '2324.84',
    close: '2325.08',
  },
  {
    time: '1719198300',
    open: '2325.08',
    high: '2325.325',
    low: '2324.42',
    close: '2325.035',
  },
  {
    time: '1719198600',
    open: '2325.035',
    high: '2326.205',
    low: '2324.8',
    close: '2325.435',
  },
  {
    time: '1719198900',
    open: '2325.435',
    high: '2326.74',
    low: '2325.325',
    close: '2326.175',
  },
  {
    time: '1719199200',
    open: '2326.175',
    high: '2326.55',
    low: '2325.06',
    close: '2325.36',
  },
  {
    time: '1719199500',
    open: '2325.36',
    high: '2326.71',
    low: '2325.32',
    close: '2325.82',
  },
  {
    time: '1719199800',
    open: '2325.82',
    high: '2326.23',
    low: '2325.57',
    close: '2325.57',
  },
  {
    time: '1719200100',
    open: '2325.57',
    high: '2325.71',
    low: '2325.23',
    close: '2325.63',
  },
  {
    time: '1719200400',
    open: '2325.63',
    high: '2326.405',
    low: '2325.61',
    close: '2325.83',
  },
  {
    time: '1719200700',
    open: '2325.83',
    high: '2325.83',
    low: '2324.91',
    close: '2325.315',
  },
  {
    time: '1719201000',
    open: '2325.315',
    high: '2325.665',
    low: '2324.875',
    close: '2325.435',
  },
  {
    time: '1719201300',
    open: '2325.435',
    high: '2325.71',
    low: '2325.385',
    close: '2325.52',
  },
  {
    time: '1719201600',
    open: '2325.52',
    high: '2325.805',
    low: '2324.985',
    close: '2325.4',
  },
  {
    time: '1719201900',
    open: '2325.4',
    high: '2325.685',
    low: '2325.2',
    close: '2325.64',
  },
  {
    time: '1719202200',
    open: '2325.64',
    high: '2326.69',
    low: '2325.625',
    close: '2326.66',
  },
  {
    time: '1719202500',
    open: '2326.66',
    high: '2326.665',
    low: '2325.785',
    close: '2325.8',
  },
  {
    time: '1719202800',
    open: '2325.8',
    high: '2326.135',
    low: '2325.745',
    close: '2326.01',
  },
  {
    time: '1719203100',
    open: '2326.01',
    high: '2326.13',
    low: '2325.435',
    close: '2326',
  },
  {
    time: '1719203400',
    open: '2326',
    high: '2326.17',
    low: '2324.985',
    close: '2325.115',
  },
  {
    time: '1719203700',
    open: '2325.115',
    high: '2325.535',
    low: '2324.945',
    close: '2325.47',
  },
  {
    time: '1719204000',
    open: '2325.47',
    high: '2325.575',
    low: '2324.78',
    close: '2325.07',
  },
  {
    time: '1719204300',
    open: '2325.07',
    high: '2325.085',
    low: '2324.335',
    close: '2324.535',
  },
  {
    time: '1719204600',
    open: '2324.535',
    high: '2324.85',
    low: '2324.51',
    close: '2324.765',
  },
  {
    time: '1719204900',
    open: '2324.765',
    high: '2324.9',
    low: '2324.225',
    close: '2324.54',
  },
  {
    time: '1719205200',
    open: '2324.54',
    high: '2325.47',
    low: '2324.525',
    close: '2325.445',
  },
  {
    time: '1719205500',
    open: '2325.445',
    high: '2325.825',
    low: '2325.07',
    close: '2325.245',
  },
  {
    time: '1719205800',
    open: '2325.245',
    high: '2326.065',
    low: '2325.19',
    close: '2326.06',
  },
  {
    time: '1719206100',
    open: '2326.06',
    high: '2326.06',
    low: '2325.505',
    close: '2325.67',
  },
  {
    time: '1719206400',
    open: '2325.67',
    high: '2326.3',
    low: '2325.58',
    close: '2326.15',
  },
  {
    time: '1719206700',
    open: '2326.15',
    high: '2326.27',
    low: '2325.68',
    close: '2325.8',
  },
  {
    time: '1719207000',
    open: '2325.8',
    high: '2327.34',
    low: '2325.535',
    close: '2325.645',
  },
  {
    time: '1719207300',
    open: '2325.645',
    high: '2325.975',
    low: '2323.94',
    close: '2323.99',
  },
  {
    time: '1719207600',
    open: '2323.99',
    high: '2324.555',
    low: '2323.74',
    close: '2324.125',
  },
  {
    time: '1719207900',
    open: '2324.125',
    high: '2325.23',
    low: '2324.125',
    close: '2325.215',
  },
  {
    time: '1719208200',
    open: '2325.215',
    high: '2325.25',
    low: '2324.415',
    close: '2325.2',
  },
  {
    time: '1719208500',
    open: '2325.2',
    high: '2325.64',
    low: '2324.805',
    close: '2325.19',
  },
  {
    time: '1719208800',
    open: '2325.19',
    high: '2325.22',
    low: '2323.185',
    close: '2323.345',
  },
  {
    time: '1719209100',
    open: '2323.345',
    high: '2324.04',
    low: '2322.82',
    close: '2323.64',
  },
  {
    time: '1719209400',
    open: '2323.64',
    high: '2323.7',
    low: '2323.12',
    close: '2323.68',
  },
  {
    time: '1719209700',
    open: '2323.68',
    high: '2324.085',
    low: '2321.855',
    close: '2322.575',
  },
  {
    time: '1719210000',
    open: '2322.575',
    high: '2323.6',
    low: '2321.405',
    close: '2323.595',
  },
  {
    time: '1719210300',
    open: '2323.595',
    high: '2324.205',
    low: '2323.18',
    close: '2323.495',
  },
  {
    time: '1719210600',
    open: '2323.495',
    high: '2325.02',
    low: '2323.42',
    close: '2324.92',
  },
  {
    time: '1719210900',
    open: '2324.92',
    high: '2325.44',
    low: '2324.395',
    close: '2324.395',
  },
  {
    time: '1719211200',
    open: '2324.395',
    high: '2324.605',
    low: '2323.66',
    close: '2323.985',
  },
  {
    time: '1719211500',
    open: '2323.985',
    high: '2323.985',
    low: '2322.52',
    close: '2322.68',
  },
  {
    time: '1719211800',
    open: '2322.68',
    high: '2323.385',
    low: '2322.105',
    close: '2323.17',
  },
  {
    time: '1719212100',
    open: '2323.17',
    high: '2323.55',
    low: '2322.95',
    close: '2323.54',
  },
  {
    time: '1719212400',
    open: '2323.54',
    high: '2323.54',
    low: '2322.175',
    close: '2322.235',
  },
  {
    time: '1719212700',
    open: '2322.235',
    high: '2323.98',
    low: '2321.84',
    close: '2323.98',
  },
  {
    time: '1719213000',
    open: '2323.98',
    high: '2325.29',
    low: '2323.98',
    close: '2325.23',
  },
  {
    time: '1719213300',
    open: '2325.23',
    high: '2325.345',
    low: '2324.365',
    close: '2325.325',
  },
  {
    time: '1719213600',
    open: '2325.325',
    high: '2326.24',
    low: '2325.145',
    close: '2326.235',
  },
  {
    time: '1719213900',
    open: '2326.235',
    high: '2327.92',
    low: '2325.805',
    close: '2327.605',
  },
  {
    time: '1719214200',
    open: '2327.605',
    high: '2329.65',
    low: '2327.035',
    close: '2329.175',
  },
  {
    time: '1719214500',
    open: '2329.175',
    high: '2329.48',
    low: '2328.055',
    close: '2329.335',
  },
  {
    time: '1719214800',
    open: '2329.335',
    high: '2331.71',
    low: '2329.335',
    close: '2331.57',
  },
  {
    time: '1719215100',
    open: '2331.57',
    high: '2331.845',
    low: '2330.435',
    close: '2331.035',
  },
  {
    time: '1719215400',
    open: '2331.035',
    high: '2331.445',
    low: '2330.61',
    close: '2330.785',
  },
  {
    time: '1719215700',
    open: '2330.785',
    high: '2331.84',
    low: '2330.68',
    close: '2330.89',
  },
  {
    time: '1719216000',
    open: '2330.89',
    high: '2332.24',
    low: '2330.805',
    close: '2331.99',
  },
  {
    time: '1719216300',
    open: '2331.99',
    high: '2332.82',
    low: '2330.59',
    close: '2330.59',
  },
  {
    time: '1719216600',
    open: '2330.59',
    high: '2330.75',
    low: '2329.19',
    close: '2330.61',
  },
  {
    time: '1719216900',
    open: '2330.61',
    high: '2331.72',
    low: '2329.385',
    close: '2330.2',
  },
  {
    time: '1719217200',
    open: '2330.2',
    high: '2330.255',
    low: '2329.47',
    close: '2329.895',
  },
  {
    time: '1719217500',
    open: '2329.895',
    high: '2331.13',
    low: '2329.725',
    close: '2329.95',
  },
  {
    time: '1719217800',
    open: '2329.95',
    high: '2331.5',
    low: '2329.905',
    close: '2330.325',
  },
  {
    time: '1719218100',
    open: '2330.325',
    high: '2330.545',
    low: '2330.01',
    close: '2330.235',
  },
  {
    time: '1719218400',
    open: '2330.235',
    high: '2330.715',
    low: '2330.085',
    close: '2330.595',
  },
  {
    time: '1719218700',
    open: '2330.595',
    high: '2331.005',
    low: '2329.445',
    close: '2329.73',
  },
  {
    time: '1719219000',
    open: '2329.73',
    high: '2331.84',
    low: '2329.685',
    close: '2331.375',
  },
  {
    time: '1719219300',
    open: '2331.375',
    high: '2331.43',
    low: '2330.535',
    close: '2330.58',
  },
  {
    time: '1719219600',
    open: '2330.58',
    high: '2331',
    low: '2329',
    close: '2329.67',
  },
  {
    time: '1719219900',
    open: '2329.67',
    high: '2329.87',
    low: '2326.205',
    close: '2326.21',
  },
  {
    time: '1719220200',
    open: '2326.21',
    high: '2328.83',
    low: '2326.03',
    close: '2328.81',
  },
  {
    time: '1719220500',
    open: '2328.81',
    high: '2329.765',
    low: '2328.63',
    close: '2329.665',
  },
  {
    time: '1719220800',
    open: '2329.665',
    high: '2330.785',
    low: '2329.33',
    close: '2330.13',
  },
  {
    time: '1719221100',
    open: '2330.13',
    high: '2330.64',
    low: '2327.54',
    close: '2327.585',
  },
  {
    time: '1719221400',
    open: '2327.585',
    high: '2327.97',
    low: '2320.865',
    close: '2324.995',
  },
  {
    time: '1719221700',
    open: '2324.995',
    high: '2326.105',
    low: '2324.135',
    close: '2326.105',
  },
  {
    time: '1719222000',
    open: '2326.105',
    high: '2327.255',
    low: '2325.67',
    close: '2327.11',
  },
  {
    time: '1719222300',
    open: '2327.11',
    high: '2327.155',
    low: '2325.215',
    close: '2325.66',
  },
  {
    time: '1719222600',
    open: '2325.66',
    high: '2325.665',
    low: '2324.47',
    close: '2325.125',
  },
  {
    time: '1719222900',
    open: '2325.125',
    high: '2325.77',
    low: '2324.69',
    close: '2325.17',
  },
  {
    time: '1719223200',
    open: '2325.17',
    high: '2325.595',
    low: '2324.565',
    close: '2325.58',
  },
  {
    time: '1719223500',
    open: '2325.58',
    high: '2327.175',
    low: '2325.355',
    close: '2326.265',
  },
  {
    time: '1719223800',
    open: '2326.265',
    high: '2327.195',
    low: '2325.1',
    close: '2326.045',
  },
  {
    time: '1719224100',
    open: '2326.045',
    high: '2326.645',
    low: '2325.565',
    close: '2326.635',
  },
  {
    time: '1719224400',
    open: '2326.635',
    high: '2326.64',
    low: '2325.285',
    close: '2325.75',
  },
  {
    time: '1719224700',
    open: '2325.75',
    high: '2326.06',
    low: '2324.595',
    close: '2324.715',
  },
  {
    time: '1719225000',
    open: '2324.715',
    high: '2326.225',
    low: '2324.585',
    close: '2325.69',
  },
  {
    time: '1719225300',
    open: '2325.69',
    high: '2326.61',
    low: '2325.475',
    close: '2326.315',
  },
  {
    time: '1719225600',
    open: '2326.315',
    high: '2326.755',
    low: '2325.67',
    close: '2325.74',
  },
  {
    time: '1719225900',
    open: '2325.74',
    high: '2326.275',
    low: '2325.525',
    close: '2325.94',
  },
  {
    time: '1719226200',
    open: '2325.94',
    high: '2326.195',
    low: '2325.125',
    close: '2325.835',
  },
  {
    time: '1719226500',
    open: '2325.835',
    high: '2326.405',
    low: '2324.665',
    close: '2325.27',
  },
  {
    time: '1719226800',
    open: '2325.27',
    high: '2325.595',
    low: '2324.675',
    close: '2325.21',
  },
  {
    time: '1719227100',
    open: '2325.21',
    high: '2326.22',
    low: '2325.065',
    close: '2325.505',
  },
  {
    time: '1719227400',
    open: '2325.505',
    high: '2326.37',
    low: '2325.105',
    close: '2325.145',
  },
  {
    time: '1719227700',
    open: '2325.145',
    high: '2325.425',
    low: '2324.645',
    close: '2325.175',
  },
  {
    time: '1719228000',
    open: '2325.175',
    high: '2325.85',
    low: '2324.22',
    close: '2325.475',
  },
  {
    time: '1719228300',
    open: '2325.475',
    high: '2325.61',
    low: '2324.995',
    close: '2325.545',
  },
  {
    time: '1719228600',
    open: '2325.545',
    high: '2327.28',
    low: '2325.44',
    close: '2327.1',
  },
  {
    time: '1719228900',
    open: '2327.1',
    high: '2327.1',
    low: '2325.495',
    close: '2326.725',
  },
  {
    time: '1719229200',
    open: '2326.725',
    high: '2328.005',
    low: '2326.47',
    close: '2327.68',
  },
  {
    time: '1719229500',
    open: '2327.68',
    high: '2328.09',
    low: '2326.98',
    close: '2327.925',
  },
  {
    time: '1719229800',
    open: '2327.925',
    high: '2328.13',
    low: '2326.615',
    close: '2326.825',
  },
  {
    time: '1719230100',
    open: '2326.825',
    high: '2326.955',
    low: '2325.965',
    close: '2326.295',
  },
  {
    time: '1719230400',
    open: '2326.295',
    high: '2326.535',
    low: '2324.15',
    close: '2326.535',
  },
  {
    time: '1719230700',
    open: '2326.535',
    high: '2326.735',
    low: '2325.265',
    close: '2325.265',
  },
  {
    time: '1719231000',
    open: '2325.265',
    high: '2326.305',
    low: '2325.055',
    close: '2325.98',
  },
  {
    time: '1719231300',
    open: '2325.98',
    high: '2326.645',
    low: '2325.535',
    close: '2326.6',
  },
  {
    time: '1719231600',
    open: '2326.6',
    high: '2326.69',
    low: '2324.445',
    close: '2324.695',
  },
  {
    time: '1719231900',
    open: '2324.695',
    high: '2325.26',
    low: '2323.405',
    close: '2325.17',
  },
  {
    time: '1719232200',
    open: '2325.17',
    high: '2327.175',
    low: '2324.875',
    close: '2326.49',
  },
  {
    time: '1719232500',
    open: '2326.49',
    high: '2327.225',
    low: '2325.08',
    close: '2326.495',
  },
  {
    time: '1719232800',
    open: '2326.495',
    high: '2327.09',
    low: '2324.115',
    close: '2325.64',
  },
  {
    time: '1719233100',
    open: '2325.64',
    high: '2326.66',
    low: '2325.49',
    close: '2325.805',
  },
  {
    time: '1719233400',
    open: '2325.805',
    high: '2327.49',
    low: '2325.78',
    close: '2327.175',
  },
  {
    time: '1719233700',
    open: '2327.175',
    high: '2327.91',
    low: '2326.445',
    close: '2327.665',
  },
  {
    time: '1719234000',
    open: '2327.665',
    high: '2327.97',
    low: '2326.61',
    close: '2326.895',
  },
  {
    time: '1719234300',
    open: '2326.895',
    high: '2327.71',
    low: '2326.085',
    close: '2327.32',
  },
  {
    time: '1719234600',
    open: '2327.32',
    high: '2328.485',
    low: '2326.955',
    close: '2328.205',
  },
  {
    time: '1719234900',
    open: '2328.205',
    high: '2328.215',
    low: '2325.97',
    close: '2326.995',
  },
  {
    time: '1719235200',
    open: '2326.995',
    high: '2328.255',
    low: '2326.4',
    close: '2327.555',
  },
  {
    time: '1719235500',
    open: '2327.555',
    high: '2331.38',
    low: '2327.035',
    close: '2330.74',
  },
  {
    time: '1719235800',
    open: '2330.74',
    high: '2333.08',
    low: '2330.54',
    close: '2332.5',
  },
  {
    time: '1719236100',
    open: '2332.5',
    high: '2333.93',
    low: '2331.26',
    close: '2332.135',
  },
  {
    time: '1719236400',
    open: '2332.135',
    high: '2332.345',
    low: '2330.705',
    close: '2331.205',
  },
  {
    time: '1719236700',
    open: '2331.205',
    high: '2332.455',
    low: '2329.055',
    close: '2329.82',
  },
  {
    time: '1719237000',
    open: '2329.82',
    high: '2332.185',
    low: '2328.905',
    close: '2331.135',
  },
  {
    time: '1719237300',
    open: '2331.135',
    high: '2331.165',
    low: '2328.04',
    close: '2328.155',
  },
  {
    time: '1719237600',
    open: '2328.155',
    high: '2330.235',
    low: '2327.025',
    close: '2329.03',
  },
  {
    time: '1719237900',
    open: '2329.03',
    high: '2330.955',
    low: '2327.9',
    close: '2330.89',
  },
  {
    time: '1719238200',
    open: '2330.89',
    high: '2331.66',
    low: '2328.49',
    close: '2329.695',
  },
  {
    time: '1719238500',
    open: '2329.695',
    high: '2329.72',
    low: '2328.35',
    close: '2328.955',
  },
  {
    time: '1719238800',
    open: '2328.955',
    high: '2331.155',
    low: '2328.425',
    close: '2330.575',
  },
  {
    time: '1719239100',
    open: '2330.575',
    high: '2330.875',
    low: '2329.155',
    close: '2329.465',
  },
  {
    time: '1719239400',
    open: '2329.465',
    high: '2332.3',
    low: '2329.455',
    close: '2331.665',
  },
  {
    time: '1719239700',
    open: '2331.665',
    high: '2333.145',
    low: '2331.04',
    close: '2332.67',
  },
  {
    time: '1719240000',
    open: '2332.67',
    high: '2333.715',
    low: '2331.335',
    close: '2333.2',
  },
  {
    time: '1719240300',
    open: '2333.2',
    high: '2333.73',
    low: '2331.715',
    close: '2332.215',
  },
  {
    time: '1719240600',
    open: '2332.215',
    high: '2332.37',
    low: '2330.31',
    close: '2331.025',
  },
  {
    time: '1719240900',
    open: '2331.025',
    high: '2331.845',
    low: '2330.215',
    close: '2330.78',
  },
  {
    time: '1719241200',
    open: '2330.78',
    high: '2332.16',
    low: '2330.645',
    close: '2331.975',
  },
  {
    time: '1719241500',
    open: '2331.975',
    high: '2332.24',
    low: '2330.86',
    close: '2331.81',
  },
  {
    time: '1719241800',
    open: '2331.81',
    high: '2333.21',
    low: '2331.22',
    close: '2332.375',
  },
  {
    time: '1719242100',
    open: '2332.375',
    high: '2332.98',
    low: '2331.325',
    close: '2332',
  },
  {
    time: '1719242400',
    open: '2332',
    high: '2332.03',
    low: '2330.64',
    close: '2331.405',
  },
  {
    time: '1719242700',
    open: '2331.405',
    high: '2331.405',
    low: '2329.855',
    close: '2330.715',
  },
  {
    time: '1719243000',
    open: '2330.715',
    high: '2331.645',
    low: '2329.165',
    close: '2329.245',
  },
  {
    time: '1719243300',
    open: '2329.245',
    high: '2330.07',
    low: '2328.955',
    close: '2328.975',
  },
  {
    time: '1719243600',
    open: '2328.975',
    high: '2329.88',
    low: '2328.795',
    close: '2329.6',
  },
  {
    time: '1719243900',
    open: '2329.6',
    high: '2329.86',
    low: '2327.72',
    close: '2328.05',
  },
  {
    time: '1719244200',
    open: '2328.05',
    high: '2328.895',
    low: '2327.73',
    close: '2327.99',
  },
  {
    time: '1719244500',
    open: '2327.99',
    high: '2328.895',
    low: '2327.55',
    close: '2327.685',
  },
  {
    time: '1719244800',
    open: '2327.685',
    high: '2329',
    low: '2326.945',
    close: '2328.96',
  },
  {
    time: '1719245100',
    open: '2328.96',
    high: '2329.285',
    low: '2328.39',
    close: '2328.91',
  },
  {
    time: '1719245400',
    open: '2328.91',
    high: '2329.805',
    low: '2328.82',
    close: '2329.665',
  },
  {
    time: '1719245700',
    open: '2329.665',
    high: '2329.805',
    low: '2328.965',
    close: '2328.965',
  },
  {
    time: '1719246000',
    open: '2328.965',
    high: '2329.625',
    low: '2328.965',
    close: '2329.245',
  },
  {
    time: '1719246300',
    open: '2329.245',
    high: '2329.72',
    low: '2328.78',
    close: '2328.96',
  },
  {
    time: '1719246600',
    open: '2328.96',
    high: '2330.92',
    low: '2328.805',
    close: '2330.845',
  },
  {
    time: '1719246900',
    open: '2330.845',
    high: '2331.045',
    low: '2330.305',
    close: '2330.965',
  },
  {
    time: '1719247200',
    open: '2330.965',
    high: '2331.5',
    low: '2330.605',
    close: '2331.215',
  },
  {
    time: '1719247500',
    open: '2331.215',
    high: '2331.555',
    low: '2330.615',
    close: '2330.945',
  },
  {
    time: '1719247800',
    open: '2330.945',
    high: '2331.365',
    low: '2330.31',
    close: '2331.13',
  },
  {
    time: '1719248100',
    open: '2331.13',
    high: '2332.305',
    low: '2331.13',
    close: '2331.765',
  },
  {
    time: '1719248400',
    open: '2331.765',
    high: '2332.135',
    low: '2331.46',
    close: '2331.565',
  },
  {
    time: '1719248700',
    open: '2331.565',
    high: '2331.76',
    low: '2330.765',
    close: '2330.86',
  },
  {
    time: '1719249000',
    open: '2330.86',
    high: '2332.05',
    low: '2330.64',
    close: '2331.96',
  },
  {
    time: '1719249300',
    open: '2331.96',
    high: '2331.97',
    low: '2331.09',
    close: '2331.375',
  },
  {
    time: '1719249600',
    open: '2331.375',
    high: '2331.555',
    low: '2330.68',
    close: '2331.455',
  },
  {
    time: '1719249900',
    open: '2331.455',
    high: '2332.23',
    low: '2330.945',
    close: '2331.83',
  },
  {
    time: '1719250200',
    open: '2331.83',
    high: '2332.21',
    low: '2331.255',
    close: '2332.205',
  },
  {
    time: '1719250500',
    open: '2332.205',
    high: '2333.06',
    low: '2332.03',
    close: '2333.06',
  },
  {
    time: '1719250800',
    open: '2333.06',
    high: '2333.24',
    low: '2332.485',
    close: '2332.495',
  },
  {
    time: '1719251100',
    open: '2332.495',
    high: '2332.545',
    low: '2331.745',
    close: '2331.79',
  },
  {
    time: '1719251400',
    open: '2331.79',
    high: '2332.21',
    low: '2331.105',
    close: '2331.51',
  },
  {
    time: '1719251700',
    open: '2331.51',
    high: '2332.4',
    low: '2331.51',
    close: '2332.135',
  },
  {
    time: '1719252000',
    open: '2332.135',
    high: '2333.125',
    low: '2332.025',
    close: '2332.605',
  },
  {
    time: '1719252300',
    open: '2332.605',
    high: '2333.495',
    low: '2332.51',
    close: '2333.355',
  },
  {
    time: '1719252600',
    open: '2333.355',
    high: '2333.67',
    low: '2332.88',
    close: '2333.66',
  },
  {
    time: '1719252900',
    open: '2333.66',
    high: '2333.955',
    low: '2332.45',
    close: '2333.075',
  },
  {
    time: '1719253200',
    open: '2333.075',
    high: '2333.995',
    low: '2333.035',
    close: '2333.955',
  },
  {
    time: '1719253500',
    open: '2333.955',
    high: '2334.085',
    low: '2333.35',
    close: '2333.62',
  },
  {
    time: '1719253800',
    open: '2333.62',
    high: '2334.245',
    low: '2333.545',
    close: '2333.76',
  },
  {
    time: '1719254100',
    open: '2333.76',
    high: '2334.045',
    low: '2333.09',
    close: '2333.68',
  },
  {
    time: '1719254400',
    open: '2333.68',
    high: '2334.095',
    low: '2333.3',
    close: '2333.95',
  },
  {
    time: '1719254700',
    open: '2333.95',
    high: '2334.73',
    low: '2333.83',
    close: '2334.435',
  },
  {
    time: '1719255000',
    open: '2334.435',
    high: '2334.545',
    low: '2333.39',
    close: '2334.01',
  },
  {
    time: '1719255300',
    open: '2334.01',
    high: '2334.145',
    low: '2333.673',
    close: '2333.81',
  },
  {
    time: '1719255600',
    open: '2333.81',
    high: '2333.825',
    low: '2331.855',
    close: '2332.12',
  },
  {
    time: '1719255900',
    open: '2332.12',
    high: '2333.05',
    low: '2331.92',
    close: '2333.035',
  },
  {
    time: '1719256200',
    open: '2333.035',
    high: '2333.445',
    low: '2332.435',
    close: '2332.45',
  },
  {
    time: '1719256500',
    open: '2332.45',
    high: '2332.505',
    low: '2330.975',
    close: '2331.155',
  },
  {
    time: '1719256800',
    open: '2331.155',
    high: '2332.605',
    low: '2330.995',
    close: '2332.395',
  },
  {
    time: '1719257100',
    open: '2332.395',
    high: '2332.51',
    low: '2331.725',
    close: '2332.08',
  },
  {
    time: '1719257400',
    open: '2332.08',
    high: '2332.135',
    low: '2331.45',
    close: '2331.725',
  },
  {
    time: '1719257700',
    open: '2331.725',
    high: '2333.27',
    low: '2331.655',
    close: '2333.035',
  },
  {
    time: '1719258000',
    open: '2333.035',
    high: '2333.435',
    low: '2332.615',
    close: '2332.92',
  },
  {
    time: '1719258300',
    open: '2332.92',
    high: '2333.195',
    low: '2332.595',
    close: '2332.885',
  },
  {
    time: '1719258600',
    open: '2332.885',
    high: '2333.1',
    low: '2332.04',
    close: '2332.095',
  },
  {
    time: '1719258900',
    open: '2332.095',
    high: '2332.17',
    low: '2331.435',
    close: '2331.745',
  },
  {
    time: '1719259200',
    open: '2331.745',
    high: '2333.145',
    low: '2331.745',
    close: '2333.095',
  },
  {
    time: '1719259500',
    open: '2333.095',
    high: '2333.58',
    low: '2333.025',
    close: '2333.355',
  },
  {
    time: '1719259800',
    open: '2333.355',
    high: '2333.37',
    low: '2332.995',
    close: '2333.06',
  },
  {
    time: '1719260100',
    open: '2333.06',
    high: '2333.365',
    low: '2333.06',
    close: '2333.19',
  },
  {
    time: '1719260400',
    open: '2333.19',
    high: '2333.365',
    low: '2333.035',
    close: '2333.06',
  },
  {
    time: '1719260700',
    open: '2333.06',
    high: '2333.345',
    low: '2332.93',
    close: '2333.18',
  },
  {
    time: '1719261000',
    open: '2333.18',
    high: '2333.245',
    low: '2332.845',
    close: '2333.045',
  },
  {
    time: '1719261300',
    open: '2333.045',
    high: '2333.35',
    low: '2333.045',
    close: '2333.25',
  },
  {
    time: '1719261600',
    open: '2333.25',
    high: '2333.25',
    low: '2332.55',
    close: '2332.645',
  },
  {
    time: '1719261900',
    open: '2332.645',
    high: '2333.28',
    low: '2332.575',
    close: '2333.13',
  },
  {
    time: '1719262200',
    open: '2333.13',
    high: '2333.93',
    low: '2333.13',
    close: '2333.805',
  },
  {
    time: '1719262500',
    open: '2333.805',
    high: '2334.475',
    low: '2333.79',
    close: '2334.43',
  },
  {
    time: '1719266400',
    open: '2334.43',
    high: '2334.43',
    low: '2333.945',
    close: '2334.05',
  },
  {
    time: '1719266700',
    open: '2334.05',
    high: '2334.45',
    low: '2333.925',
    close: '2333.925',
  },
  {
    time: '1719267000',
    open: '2333.925',
    high: '2334.135',
    low: '2333.815',
    close: '2333.86',
  },
  {
    time: '1719267300',
    open: '2333.86',
    high: '2333.86',
    low: '2333.055',
    close: '2333.055',
  },
  {
    time: '1719267600',
    open: '2333.055',
    high: '2333.26',
    low: '2332.97',
    close: '2333.235',
  },
  {
    time: '1719267900',
    open: '2333.235',
    high: '2333.66',
    low: '2333.235',
    close: '2333.39',
  },
  {
    time: '1719268200',
    open: '2333.39',
    high: '2333.44',
    low: '2332.99',
    close: '2332.99',
  },
  {
    time: '1719268500',
    open: '2332.99',
    high: '2333.07',
    low: '2332.745',
    close: '2332.835',
  },
  {
    time: '1719268800',
    open: '2332.835',
    high: '2332.92',
    low: '2332.505',
    close: '2332.51',
  },
  {
    time: '1719269100',
    open: '2332.51',
    high: '2332.645',
    low: '2332.33',
    close: '2332.52',
  },
  {
    time: '1719269400',
    open: '2332.52',
    high: '2332.525',
    low: '2332.355',
    close: '2332.42',
  },
  {
    time: '1719269700',
    open: '2332.42',
    high: '2332.42',
    low: '2331.78',
    close: '2331.855',
  },
  {
    time: '1719270000',
    open: '2331.855',
    high: '2332.03',
    low: '2331.225',
    close: '2331.35',
  },
  {
    time: '1719270300',
    open: '2331.35',
    high: '2331.83',
    low: '2330.75',
    close: '2331.025',
  },
  {
    time: '1719270600',
    open: '2331.025',
    high: '2331.025',
    low: '2330.335',
    close: '2330.57',
  },
  {
    time: '1719270900',
    open: '2330.57',
    high: '2331.07',
    low: '2330.405',
    close: '2331.04',
  },
  {
    time: '1719271200',
    open: '2331.04',
    high: '2331.145',
    low: '2330.885',
    close: '2331.035',
  },
  {
    time: '1719271500',
    open: '2331.035',
    high: '2331.235',
    low: '2330.835',
    close: '2331.015',
  },
  {
    time: '1719271800',
    open: '2331.015',
    high: '2331.355',
    low: '2330.83',
    close: '2331.25',
  },
  {
    time: '1719272100',
    open: '2331.25',
    high: '2331.57',
    low: '2331.04',
    close: '2331.18',
  },
  {
    time: '1719272400',
    open: '2331.18',
    high: '2331.375',
    low: '2330.903',
    close: '2331.03',
  },
  {
    time: '1719272700',
    open: '2331.03',
    high: '2331.225',
    low: '2330.79',
    close: '2330.915',
  },
  {
    time: '1719273000',
    open: '2330.915',
    high: '2331.415',
    low: '2330.565',
    close: '2331.145',
  },
  {
    time: '1719273300',
    open: '2331.145',
    high: '2331.415',
    low: '2330.665',
    close: '2330.91',
  },
  {
    time: '1719273600',
    open: '2330.91',
    high: '2331.04',
    low: '2330.33',
    close: '2330.58',
  },
  {
    time: '1719273900',
    open: '2330.58',
    high: '2330.605',
    low: '2329.775',
    close: '2329.985',
  },
  {
    time: '1719274200',
    open: '2329.985',
    high: '2330.045',
    low: '2329.605',
    close: '2329.605',
  },
  {
    time: '1719274500',
    open: '2329.605',
    high: '2330.1',
    low: '2329.335',
    close: '2330.095',
  },
  {
    time: '1719274800',
    open: '2330.095',
    high: '2330.34',
    low: '2329.81',
    close: '2329.865',
  },
  {
    time: '1719275100',
    open: '2329.865',
    high: '2329.99',
    low: '2329.03',
    close: '2329.195',
  },
  {
    time: '1719275400',
    open: '2329.195',
    high: '2329.85',
    low: '2329.01',
    close: '2329.015',
  },
  {
    time: '1719275700',
    open: '2329.015',
    high: '2329.215',
    low: '2328.315',
    close: '2328.315',
  },
  {
    time: '1719276000',
    open: '2328.315',
    high: '2329.49',
    low: '2328.315',
    close: '2329.21',
  },
  {
    time: '1719276300',
    open: '2329.21',
    high: '2329.935',
    low: '2329.115',
    close: '2329.78',
  },
  {
    time: '1719276600',
    open: '2329.78',
    high: '2330.465',
    low: '2329.475',
    close: '2330.435',
  },
  {
    time: '1719276900',
    open: '2330.435',
    high: '2330.53',
    low: '2329.91',
    close: '2330.185',
  },
  {
    time: '1719277200',
    open: '2330.185',
    high: '2330.975',
    low: '2329.605',
    close: '2330.215',
  },
  {
    time: '1719277500',
    open: '2330.215',
    high: '2330.605',
    low: '2329.23',
    close: '2329.24',
  },
  {
    time: '1719277800',
    open: '2329.24',
    high: '2330.175',
    low: '2328.68',
    close: '2329.89',
  },
  {
    time: '1719278100',
    open: '2329.89',
    high: '2330.09',
    low: '2328.43',
    close: '2328.655',
  },
  {
    time: '1719278400',
    open: '2328.655',
    high: '2328.74',
    low: '2327.295',
    close: '2328.045',
  },
  {
    time: '1719278700',
    open: '2328.045',
    high: '2328.695',
    low: '2326.485',
    close: '2327.205',
  },
  {
    time: '1719279000',
    open: '2327.205',
    high: '2327.63',
    low: '2325.795',
    close: '2326.69',
  },
  {
    time: '1719279300',
    open: '2326.69',
    high: '2327.28',
    low: '2325.995',
    close: '2325.995',
  },
  {
    time: '1719279600',
    open: '2325.995',
    high: '2326.21',
    low: '2324.81',
    close: '2324.86',
  },
  {
    time: '1719279900',
    open: '2324.86',
    high: '2325.505',
    low: '2323.435',
    close: '2324.385',
  },
  {
    time: '1719280200',
    open: '2324.385',
    high: '2324.65',
    low: '2323.25',
    close: '2324.14',
  },
  {
    time: '1719280500',
    open: '2324.14',
    high: '2325.975',
    low: '2324.085',
    close: '2325.915',
  },
  {
    time: '1719280800',
    open: '2325.915',
    high: '2327.125',
    low: '2325.65',
    close: '2327.125',
  },
  {
    time: '1719281100',
    open: '2327.125',
    high: '2327.125',
    low: '2325.39',
    close: '2326.06',
  },
  {
    time: '1719281400',
    open: '2326.06',
    high: '2326.17',
    low: '2324.58',
    close: '2325.2',
  },
  {
    time: '1719281700',
    open: '2325.2',
    high: '2325.715',
    low: '2324.82',
    close: '2325.515',
  },
  {
    time: '1719282000',
    open: '2325.515',
    high: '2325.915',
    low: '2325.19',
    close: '2325.6',
  },
  {
    time: '1719282300',
    open: '2325.6',
    high: '2326.66',
    low: '2325.6',
    close: '2326.18',
  },
  {
    time: '1719282600',
    open: '2326.18',
    high: '2327.135',
    low: '2325.645',
    close: '2326.57',
  },
  {
    time: '1719282900',
    open: '2326.57',
    high: '2327.08',
    low: '2325.535',
    close: '2326.82',
  },
  {
    time: '1719283200',
    open: '2326.82',
    high: '2326.915',
    low: '2326.1',
    close: '2326.475',
  },
  {
    time: '1719283500',
    open: '2326.475',
    high: '2327.125',
    low: '2325.91',
    close: '2326.045',
  },
  {
    time: '1719283800',
    open: '2326.045',
    high: '2326.385',
    low: '2325.42',
    close: '2325.425',
  },
  {
    time: '1719284100',
    open: '2325.425',
    high: '2326.855',
    low: '2325.16',
    close: '2326.575',
  },
  {
    time: '1719284400',
    open: '2326.575',
    high: '2327.43',
    low: '2326.51',
    close: '2327.075',
  },
  {
    time: '1719284700',
    open: '2327.075',
    high: '2328.54',
    low: '2326.865',
    close: '2327.72',
  },
  {
    time: '1719285000',
    open: '2327.72',
    high: '2328.405',
    low: '2327.405',
    close: '2327.99',
  },
  {
    time: '1719285300',
    open: '2327.99',
    high: '2328.345',
    low: '2327.47',
    close: '2327.8',
  },
  {
    time: '1719285600',
    open: '2327.8',
    high: '2328.2',
    low: '2327.14',
    close: '2327.615',
  },
  {
    time: '1719285900',
    open: '2327.615',
    high: '2328.66',
    low: '2327.49',
    close: '2328.145',
  },
  {
    time: '1719286200',
    open: '2328.145',
    high: '2328.155',
    low: '2327.165',
    close: '2327.28',
  },
  {
    time: '1719286500',
    open: '2327.28',
    high: '2327.93',
    low: '2327.09',
    close: '2327.7',
  },
  {
    time: '1719286800',
    open: '2327.7',
    high: '2327.745',
    low: '2327.1',
    close: '2327.15',
  },
  {
    time: '1719287100',
    open: '2327.15',
    high: '2327.37',
    low: '2326.575',
    close: '2327.01',
  },
  {
    time: '1719287400',
    open: '2327.01',
    high: '2327.03',
    low: '2325.255',
    close: '2325.55',
  },
  {
    time: '1719287700',
    open: '2325.55',
    high: '2325.695',
    low: '2324.08',
    close: '2324.2',
  },
  {
    time: '1719288000',
    open: '2324.2',
    high: '2324.595',
    low: '2322.835',
    close: '2323.05',
  },
  {
    time: '1719288300',
    open: '2323.05',
    high: '2325.71',
    low: '2322.76',
    close: '2325.695',
  },
  {
    time: '1719288600',
    open: '2325.695',
    high: '2326.435',
    low: '2325.46',
    close: '2325.985',
  },
  {
    time: '1719288900',
    open: '2325.985',
    high: '2326.235',
    low: '2325.655',
    close: '2325.99',
  },
  {
    time: '1719289200',
    open: '2325.99',
    high: '2326.565',
    low: '2325.685',
    close: '2326.41',
  },
  {
    time: '1719289500',
    open: '2326.41',
    high: '2326.84',
    low: '2326.28',
    close: '2326.415',
  },
  {
    time: '1719289800',
    open: '2326.415',
    high: '2327.25',
    low: '2326.27',
    close: '2326.855',
  },
  {
    time: '1719290100',
    open: '2326.855',
    high: '2326.855',
    low: '2326.335',
    close: '2326.705',
  },
  {
    time: '1719290400',
    open: '2326.705',
    high: '2327.615',
    low: '2326.7',
    close: '2327.395',
  },
  {
    time: '1719290700',
    open: '2327.395',
    high: '2327.44',
    low: '2326.885',
    close: '2327.03',
  },
  {
    time: '1719291000',
    open: '2327.03',
    high: '2327.76',
    low: '2326.925',
    close: '2327.135',
  },
  {
    time: '1719291300',
    open: '2327.135',
    high: '2327.845',
    low: '2327.135',
    close: '2327.505',
  },
  {
    time: '1719291600',
    open: '2327.505',
    high: '2327.87',
    low: '2327.135',
    close: '2327.705',
  },
  {
    time: '1719291900',
    open: '2327.705',
    high: '2328.67',
    low: '2327.5',
    close: '2328.415',
  },
  {
    time: '1719292200',
    open: '2328.415',
    high: '2328.615',
    low: '2327.845',
    close: '2327.865',
  },
  {
    time: '1719292500',
    open: '2327.865',
    high: '2328.2',
    low: '2327.495',
    close: '2327.695',
  },
  {
    time: '1719292800',
    open: '2327.695',
    high: '2328.565',
    low: '2327.695',
    close: '2328.47',
  },
  {
    time: '1719293100',
    open: '2328.47',
    high: '2329.505',
    low: '2328.15',
    close: '2329.47',
  },
  {
    time: '1719293400',
    open: '2329.47',
    high: '2330.21',
    low: '2328.685',
    close: '2329.03',
  },
  {
    time: '1719293700',
    open: '2329.03',
    high: '2329.15',
    low: '2326.235',
    close: '2326.57',
  },
  {
    time: '1719294000',
    open: '2326.57',
    high: '2326.675',
    low: '2325.38',
    close: '2326.035',
  },
  {
    time: '1719294300',
    open: '2326.035',
    high: '2326.43',
    low: '2325.265',
    close: '2325.39',
  },
  {
    time: '1719294600',
    open: '2325.39',
    high: '2326.095',
    low: '2324.73',
    close: '2325.41',
  },
  {
    time: '1719294900',
    open: '2325.41',
    high: '2325.41',
    low: '2324.62',
    close: '2325.07',
  },
  {
    time: '1719295200',
    open: '2325.07',
    high: '2325.335',
    low: '2323.895',
    close: '2324.145',
  },
  {
    time: '1719295500',
    open: '2324.145',
    high: '2324.765',
    low: '2323.805',
    close: '2324.155',
  },
  {
    time: '1719295800',
    open: '2324.155',
    high: '2324.76',
    low: '2323.485',
    close: '2324.695',
  },
  {
    time: '1719296100',
    open: '2324.695',
    high: '2324.96',
    low: '2324.275',
    close: '2324.92',
  },
  {
    time: '1719296400',
    open: '2324.92',
    high: '2325.445',
    low: '2324.13',
    close: '2324.795',
  },
  {
    time: '1719296700',
    open: '2324.795',
    high: '2325.565',
    low: '2324.51',
    close: '2324.78',
  },
  {
    time: '1719297000',
    open: '2324.78',
    high: '2325.2200000000003',
    low: '2324.42',
    close: '2325.055',
  },
  {
    time: '1719297300',
    open: '2325.055',
    high: '2326.02',
    low: '2325.045',
    close: '2325.43',
  },
  {
    time: '1719297600',
    open: '2325.43',
    high: '2325.62',
    low: '2325.325',
    close: '2325.62',
  },
];

// Example usage with mock data
const trade = {
  id: 1,
  direction: 'BUY NOW',
  dateOpen: '24/06/2024 17:10',
  entry: 2325.701,
  SL: 2323,
  TP1: 2332.228,
  TP2: 2334.404,
  TP3: 2339.36,
  TP4: null,
  TP5: null,
};

const hasilnya = {
  id: 1114578,
  notActive: false,
  winTP1: true,
  winTP2: true,
  winTP3: false,
  winTP4: false,
  winTP5: false,
  hitBE_TP1: false,
  hitBE_TP2: true,
  hitBE_1R: false,
  breakevenAftar2R: false,
  breakevenAftar3R: false,
  breakevenAftar4R: false,
  breakevenAftar5R: false,
  isLose: false,
  ddPrice: 2323.405, //2323.250
  maxPrice: 2334.699,
  dateCloseMax: '25/06/2024 01:45',
};

const result = analyzeTrade(trade, data);
console.log(result);
