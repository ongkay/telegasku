function parseMessage(message) {
  const dataPair = ['XAUUSD', 'USDJPY', 'USOIL', 'EURUSD', 'GBPJPY'];

  let messageText = message?.text ?? message;
  let messageForumName = message?.reply_to_message?.forum_topic_created?.name;

  const data = {};

  const regAngka = /\d+\.?\d*/;
  const regValue = /@ (\d+)/;

  const regSymbol = /[_@:-\s]+/;
  const regexUrl =
    /^(http[s]?:\/\/(www\.)?|ftp:\/\/(www\.)?|www\.){1}([0-9A-Za-z-\.@:%_\+~#=]+)+((\.[a-zA-Z]{2,3})+)(\/(.)*)?(\?(.)*)?/g;

  const getValue = (d) => {
    const regex = /[@:]\s*(\d+(\.\d+)?)/;
    let v = d.match(regex)[1];
    return parseFloat(v);
  };

  let linkSS = [];
  let allTp = [];
  let dataMessageText;

  if (messageText.includes('\n')) {
    dataMessageText = messageText.split('\n');
  } else {
    dataMessageText = [messageText];
  }
  try {
    dataMessageText.forEach((el) => {
      const dataText = el.toUpperCase();

      if (el.match(regexUrl)) {
        linkSS.push(el);
      }

      if (!data.Pair) {
        if (/(gold|xau)/i.test(dataText)) {
          data.Pair = 'XAUUSD';
        } else {
          dataPair.map((item) => {
            dataText.includes(item) ? (data.Pair = item) : '';
          });
        }
      }

      if (/\/(INPUT|EDIT|DEL)/i.test(dataText)) {
        console.log('ada');
        data.cmd = dataText;
      }

      if (dataText.includes('WARN')) {
        data.isWarning = true;
      }

      if (/(tp1|tp 1)/i.test(dataText)) {
        console.log('ada');
        console.log(dataText.match(regValue)[1]);
      }

      if (el.match(regSymbol)) {
        const dataSplit = el.toUpperCase().replace(regSymbol, '@');

        if (dataSplit.includes('MAX')) {
          let dataEntry = dataSplit.match(regAngka)[0];
          data.Max_Price = Number(dataEntry);
        }

        if (dataSplit.includes('DD')) {
          let dataEntry = dataSplit.match(regAngka)[0];
          data.DD_Price = Number(dataEntry);
        }

        //Entry_2
        if (dataSplit.includes('OTHER') || dataSplit.includes('ENTRY2')) {
          const otherLimit = dataSplit.match(regAngka)[0];
          data.Entry_2 = Number(otherLimit);
        }

        // Direction
        if (dataSplit.includes('SELL')) {
          const isLimit = dataSplit.includes('LIMIT');
          const isStop = dataSplit.includes('STOP');
          data.Direction = isLimit ? 'SELL LIMIT' : isStop ? 'SELL STOP' : 'SELL NOW';
          let dataEntry = dataSplit.match(regAngka);
          data.Entry = dataEntry ? Number(dataEntry[0]) : null;
        } else if (dataSplit.includes('BUY')) {
          const isLimit = dataSplit.includes('LIMIT');
          const isStop = dataSplit.includes('STOP');
          data.Direction = isLimit ? 'BUY LIMIT' : isStop ? 'BUY STOP' : 'BUY NOW';
          let dataEntry = dataSplit.match(regAngka);
          data.Entry = dataEntry ? Number(dataEntry[0]) : null;
        }

        if (dataSplit.includes('@')) {
          const splitAtt = dataSplit.split('@');

          if (splitAtt[0] == 'ENTRY') {
            let dataEntry = dataSplit.match(regAngka)[0];
            data.Entry = Number(dataEntry);
          }

          if (dataSplit.includes('_id')) {
            data._id = splitAtt[1];
          }

          if (dataSplit.includes('BETP1')) {
            data.BETP1 = splitAtt[1];
          }

          if (dataSplit.includes('EFIB')) {
            data.Efib_Level = splitAtt[1];
          }

          if (dataSplit.includes('REF')) {
            data.Ref = splitAtt[1];
          }

          if (dataText.includes('ACC')) {
            data.Account = splitAtt[1];
          }

          if (dataSplit.includes('RISK')) {
            data.Risk = splitAtt[1];
          }

          if (dataSplit.includes('NOTE')) {
            data.Note = splitAtt[1].toLowerCase();
          }

          if (dataSplit.includes('CONFIRM')) {
            data.Confirm = splitAtt[1].toLowerCase();
          }

          if (dataSplit.includes('TF')) {
            data.Time_Frame = splitAtt[1].toLowerCase();
          }

          if (dataSplit.includes('NEWS')) {
            data.News = Number(splitAtt[1]);
          }
          if (dataSplit.includes('STATUS')) {
            data.Status = splitAtt[1];
          }

          // TP, TPP, SL, Date
          if (dataSplit.includes('TP')) {
            if (dataSplit.includes('TPP')) {
              data.TP_Half = getValue(dataSplit);
            } else if (/(TP 1)/i.test(dataText)) {
              let v = dataText.replace('TP 1', 'TP');
              data.TP_1 = getValue(v);
            } else if (/(TP 2)/i.test(dataText)) {
              let v = dataText.replace('TP 2', 'TP');
              data.TP_2 = getValue(v);
            } else if (dataSplit.includes('TP1')) {
              data.TP_1 = getValue(dataSplit);
            } else if (dataSplit.includes('TP2')) {
              data.TP_2 = getValue(dataSplit);
            } else if (dataSplit.includes('TP3')) {
              data.TP_3 = getValue(dataSplit);
            } else if (dataSplit.includes('TP4')) {
              data.TP_4 = getValue(dataSplit);
            } else if (dataSplit.includes('TP5')) {
              data.TP_5 = getValue(dataSplit);
            } else {
              splitAtt.forEach((r) => {
                if (r.includes('TP')) {
                } else if (r.match(regAngka)) {
                  allTp.push(r);
                }
              });
            }
          } else if (dataSplit.includes('SL')) {
            const slprice = getValue(dataSplit);
            dataSplit.includes('SL2') ? (data.SL_2 = slprice) : (data.SL = slprice);
          } else if (dataSplit.includes('DATE_CLOSE')) {
            let tgl = splitAtt[1];
            data.Date_close = parseDate(tgl);
          } else if (dataSplit.includes('DATE')) {
            let tgl = splitAtt[1];
            data.Date = parseDate(tgl);
          }
        }
      }
    });

    // add TP price to data
    if (allTp.length > 0) {
      allTp.map((item, i) => {
        let price = Number(item);
        data[`TP_${i + 1}`] = price;
      });
    }

    if (linkSS.length > 0) data.URL_Pic = linkSS;
    if (!data.Account && messageForumName) data.Account = messageForumName;
  } catch (error) {
    console.log(error.message);
  } finally {
    return data;
  }
}

// -========================================================================================================

let update = {
  update_id: 708507456,
  message: {
    message_id: 1219,
    from: {
      id: 6770187132,
      is_bot: false,
      first_name: 'setiawan',
      username: 'ongtrade',
      language_code: 'en',
    },
    chat: {
      id: -1002065173361,
      title: 'Performa-Signal',
      is_forum: true,
      type: 'supergroup',
    },
    date: 1715756446,
    message_thread_id: 8,
    reply_to_message: {
      message_id: 8,
      from: {
        id: 441522292,
        is_bot: false,
        first_name: 'Hongki',
        last_name: 'Setiawan',
        username: 'ongkii',
      },
      chat: {
        id: -1002065173361,
        title: 'Performa-Signal',
        is_forum: true,
        type: 'supergroup',
      },
      date: 1701389406,
      message_thread_id: 8,
      forum_topic_created: {
        name: 'GFR Analysis',
        icon_color: 7322096,
      },
      is_topic_message: true,
    },
    text: '/input\nhttps://i.imgur.com/SUoBTZR.png\nhttps://imgur.com/screenshot-SUoBTZR\n#GTR\nDate @ 22/03 \nnote @ Ini adalah note\nconfirm @ CB1 M5\nstatus @ running\ntf @ m15\nnews @ 3\nGold sell limit @ 2367\nwarning\nOther limit @ 2339\ntp 1 @ 2351\ntp 2 @ 2332\ntp3 2333\ntp4 @2334\ntpp : 2021\n\nTp5_________________2555\n\nSL @ 2377.88\nSL2 @ 2388',
    // text: '/input\nhttps://i.imgur.com/SUoBTZR.png\nhttps://imgur.com/screenshot-SUoBTZR\n#GTR\nDate @ 22/03 \nnote @ Ini adalah note\nconfirm @ CB1 M5\nstatus @ running\ntf @ m15\nnews @ 3\nGold sell limit\nwarning\nOther limit @ 2339\ntp 1 @ 2351\ntp 2 @ 2332\ntp3 2333\ntp4 @2334\ntpp : 2021\n\nTp5_________________2555\n\nSL @ 2377.88\nSL2 @ 2388',

    // text: '_id @ wfr657685\nAccount @ WFR Analysis\nDirection @ SELL NOW\nisWarning @ true\nEntry @ 2367\nTP_1 @ 2354\nTP_2 @ 2334\nTP_3 @ 2339\nSL @ 2377\nConfirm @ cb1 m30\nNote @ oke juga ini adalah note\nPair @ XAUUSD\nCreated @ Thu Jun 06 2024 17:36:57 GMT+0700 (Western Indonesia Time)',

    entities: [
      {
        offset: 0,
        length: 6,
        type: 'bot_command',
      },
      {
        offset: 33,
        length: 5,
        type: 'mention',
      },
    ],
    is_topic_message: true,
  },
};

console.log(parseMessage(update.message));
// -========================================================================================================

//==================================================
// fn parse date
//==================================================
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
  console.log(d.getHours());

  return d;
}

//==================================================
// fn untuk mendapatkan format time yg benar
//==================================================
function getDateTime(date, forSheet = false) {
  const d = new Date(date);
  // const d = d;
  let yyyy = d.getFullYear();
  let mm = d.getMonth() + 1; // month is zero-based
  let dd = d.getDate();
  let HH = d.getHours();
  let m = d.getMinutes();
  let getTime = d.getTime();

  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;
  if (HH < 10) HH = '0' + HH;
  if (m < 10) m = '0' + m;

  const formatted = dd + '/' + mm + '/' + yyyy + ' ' + HH + ':' + m;
  const formatSheet = mm + '/' + dd + '/' + yyyy + ' ' + HH + ':' + m + ':' + '00';

  return forSheet ? formatSheet : formatted;
}

//==================================================
// fn untuk menghapus obj yg properties nilainya null
//==================================================
const removeNullObj = (obj) => {
  return Object.keys(obj).reduce((acc, current) => {
    if (obj[current] !== null) {
      return { ...acc, [current]: obj[current] };
    }
    return acc;
  }, {});
};

// =============================
// buat map object seperti map pada array dengan value dan key(properties)
// =============================
const mapObj = function (obj, callback) {
  let result = {};

  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (typeof callback === 'function') {
        result[key] = callback.call(obj, obj[key], key, obj);
      }
    }
  }

  return result;
};

//==================================================

function parseStringToObject(dataString) {
  // Split the data string into lines
  var lines = dataString.split('\n');

  // Initialize an empty object to store data
  var dataObject = {};

  // Iterate through each line
  for (var line of lines) {
    // Split the line into key-value pair

    let allLine = line.replace(/[@:-\s]+/, '@');
    var parts = allLine.split('@');
    if (parts.length === 2) {
      // Extract key and value
      var key = parts[0].trim(); // Remove leading and trailing spaces
      var value = parts[1].trim(); // Remove leading and trailing spaces

      // Convert key to lowercase for consistency
      key = key.toLowerCase();

      // Handle special cases for numeric values
      if (['entry', 'tp_1', 'tp_2', 'tp_3', 'sl'].includes(key)) {
        value = parseFloat(value); // Convert to number
      } else if (key === 'iswarning') {
        value = value.toLowerCase() === 'true'; // Convert to boolean
      }

      // Add key-value pair to the object
      dataObject[key] = value;
    }
  }

  // Return the parsed data object
  return dataObject;
}

//===============================================

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

function getCountDollars(entry, tpOrSl, pair = 'XAUUSD', lotSize) {
  pair = pair.toLowerCase();
  let pips = getCountPips(entry, tpOrSl, pair);

  !lotSize ? (lotSize = 0.01) : null;

  const data = dataPair[pair];
  let res = pips * lotSize * data.price;
  return Math.round(res * 100) / 100;
}

function removePropertiesObj(object, namePropertyArray) {
  // Use a for loop to iterate through the properties to remove
  for (const property of namePropertyArray) {
    if (object.hasOwnProperty(property)) {
      delete object[property];
    }
  }
  return object;
}
// const dataString = 'tp1@2575 30pips ';
// const regex = /@(\d+)/;
// const match = dataString.match(regex);
// console.log(match);
// const result = match ? match[1] : null;

// console.log(result); // Output: 2575

//========================
const dataStrings = [
  'tp1@2575.99',
  'TP@2 @ 2332',
  'tp 1 @ 2887.575',
  'tp1 @ 2575 (30 pips)',
  'tp1 : 2575',
  'tp1 : 2575 (30 pips)',
];

// const regex = /[@:]\s*(\d+)/;
const regex = /[@:]\s*(\d+(\.\d+)?)/;

dataStrings.forEach((dataString) => {
  const match = dataString.match(regex);
  const result = match ? match[1] : null;
  console.log(result); // Output: 2575
});

//====================
// const dataStrings = [
//   "tp1 @ 2575",
//   "tp 1 @ 55575",
//   "tp1 @ 2575 (30 pips)",
//   "tp1 : 2575",
//   "tp1 : 2575 (30 pips)",
//   "tp1 2575",
//   "tp1 2575 (30 pips)"
// ];

// const regex = /[@: ]\s?(\d{4})/;

// dataStrings.forEach(dataString => {
//   const match = dataString.match(regex);
//   const result = match ? match[1] : null;
//   console.log(result); // Output: 2575
// });
