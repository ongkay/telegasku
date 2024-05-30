function parseMessage2(message) {
  let messageText = message?.text ?? message;
  let messageForumName = message?.reply_to_message?.forum_topic_created?.name;

  const data = {
    cmd: null,
    account: null,
    status: null,
    date: null,
    time: null,
    direction: null,
    isWarning: null,
    entry: null,
    entry2nd: null,
    take_profit_1: null,
    take_profit_2: null,
    take_profit_3: null,
    take_profit_4: null,
    take_profit_5: null,
    TP_Partial: null,
    stop_loss: null,
    stop_loss_2: null,
    news: null,
    confirm: null,
    note: null,
    timeFrame: null,
    urlPic: null,
  };

  const regAngka = /\d+\.?\d*/;
  const regSymbol = /[_@:-\s]+/;
  const regexUrl =
    /^(http[s]?:\/\/(www\.)?|ftp:\/\/(www\.)?|www\.){1}([0-9A-Za-z-\.@:%_\+~#=]+)+((\.[a-zA-Z]{2,3})+)(\/(.)*)?(\?(.)*)?/g;

  let jam = null;
  let tgl = null;
  let linkSS = [];
  let allTp = [];
  let dataMessageText;

  if (messageText.includes('\n')) {
    dataMessageText = messageText.split('\n');
  } else {
    dataMessageText = [dataMessageText];
  }

  dataMessageText.forEach((el) => {
    const dataSplit = el.toUpperCase().replace(regSymbol, '@');
    // console.log(splitAtt);

    if (el.match(regexUrl)) {
      linkSS.push(el);
    }

    if (
      dataSplit.includes('/INPUT') ||
      dataSplit.includes('/EDIT') ||
      dataSplit.includes('/DEL')
    ) {
      data.cmd = dataSplit;
    }

    if (dataSplit.includes('#')) {
      console.log(dataSplit);

      data.account = dataSplit.split('#')[1];
    }

    if (dataSplit.includes('WARN')) {
      data.isWarning = true;
    }

    if (dataSplit.includes('ENTRY')) {
      let dataEntry = dataSplit.match(regAngka)[0];
      data.entry = Number(dataEntry);
    }

    //entry2nd
    if (dataSplit.includes('OTHER') || dataSplit.includes('ENTRY2')) {
      const otherLimit = dataSplit.match(regAngka)[0];
      data.entry2nd = Number(otherLimit);
    }

    // direction
    if (dataSplit.includes('SELL')) {
      data.direction = dataSplit.includes('LIMIT') ? 'SELL LIMIT' : 'SELL NOW';
      let dataEntry = dataSplit.match(regAngka)[0];
      data.entry = Number(dataEntry);
    } else if (dataSplit.includes('BUY')) {
      data.direction = dataSplit.includes('LIMIT') ? 'BUY LIMIT' : 'BUY NOW';
    }

    if (dataSplit.includes('@')) {
      const splitAtt = dataSplit.split('@');

      if (dataSplit.includes('NOTE')) {
        data.note = splitAtt[1].toLowerCase();
      }

      if (dataSplit.includes('CONFIRM')) {
        data.confirm = splitAtt[1].toLowerCase();
      }

      if (dataSplit.includes('TF')) {
        data.timeFrame = splitAtt[1].toLowerCase();
      }

      if (dataSplit.includes('NEWS')) {
        data.news = Number(splitAtt[1]);
      }
      if (dataSplit.includes('STATUS')) {
        data.status = splitAtt[1];
      }

      // TP, TPP, SL, Date
      if (dataSplit.includes('TP')) {
        if (dataSplit.includes('TPP')) {
          data.TP_Partial = Number(splitAtt[1]);
        } else {
          splitAtt.forEach((r) => {
            if (r.includes('TP')) {
            } else if (r.match(regAngka)) {
              allTp.push(r);
            }
          });
        }
      } else if (dataSplit.includes('SL')) {
        const slprice = Number(splitAtt[1]);
        dataSplit.includes('SL2')
          ? (data.stop_loss_2 = slprice)
          : (data.stop_loss = slprice);
      } else if (dataSplit.includes('DATE')) {
        tgl = splitAtt[1];
        let date = getDateTime(parseDate(tgl));
        data.date = date.split(' ')[0];
        data.time = date.split(' ')[1];
      } else if (dataSplit.includes('TIME')) {
        data.time = splitAtt[1];
      }
    }
  });

  // add TP pride to data
  allTp.map((item, i) => {
    let price = Number(item);
    data[`take_profit_${i + 1}`] = price;
  });

  data.urlPic = linkSS;
  if (!data.account) data.account = messageForumName;

  return data;
}

function parseMessage(message) {
  let messageText = message?.text ?? message;
  let messageForumName = message?.reply_to_message?.forum_topic_created?.name;

  const data = {
    cmd: null,
    account: null,
    status: null,
    date: null,
    time: null,
    direction: null,
    isWarning: null,
    entry: null,
    entry2nd: null,
    take_profit_1: null,
    take_profit_2: null,
    take_profit_3: null,
    take_profit_4: null,
    take_profit_5: null,
    TP_Partial: null,
    stop_loss: null,
    stop_loss_2: null,
    news: null,
    confirm: null,
    note: null,
    timeFrame: null,
    urlPic: null,
  };

  const regAngka = /\d+\.?\d*/;
  const regSymbol = /[_@:-\s]+/;
  const regexUrl =
    /^(http[s]?:\/\/(www\.)?|ftp:\/\/(www\.)?|www\.){1}([0-9A-Za-z-\.@:%_\+~#=]+)+((\.[a-zA-Z]{2,3})+)(\/(.)*)?(\?(.)*)?/g;

  let linkSS = [];
  let allTp = [];
  let dataMessageText;

  if (messageText.includes('\n')) {
    dataMessageText = messageText.split('\n');
  } else {
    dataMessageText = [dataMessageText];
  }

  dataMessageText.forEach((el) => {
    const dataText = el.toUpperCase();

    if (el.match(regexUrl)) {
      linkSS.push(el);
    }

    if (dataText.includes('#')) {
      data.account = dataText.split('#')[1];
    }

    if (
      dataText.includes('/INPUT') ||
      dataText.includes('/EDIT') ||
      dataText.includes('/DEL')
    ) {
      data.cmd = dataText;
    }

    if (dataText.includes('WARN')) {
      data.isWarning = true;
    }

    if (el.match(regSymbol)) {
      const dataSplit = el.toUpperCase().replace(regSymbol, '@');

      if (dataSplit.includes('ENTRY')) {
        let dataEntry = dataSplit.match(regAngka)[0];
        data.entry = Number(dataEntry);
      }

      //entry2nd
      if (dataSplit.includes('OTHER') || dataSplit.includes('ENTRY2')) {
        const otherLimit = dataSplit.match(regAngka)[0];
        data.entry2nd = Number(otherLimit);
      }

      // direction
      if (dataSplit.includes('SELL')) {
        data.direction = dataSplit.includes('LIMIT') ? 'SELL LIMIT' : 'SELL NOW';
        let dataEntry = dataSplit.match(regAngka)[0];
        data.entry = Number(dataEntry);
      } else if (dataSplit.includes('BUY')) {
        data.direction = dataSplit.includes('LIMIT') ? 'BUY LIMIT' : 'BUY NOW';
      }

      if (dataSplit.includes('@')) {
        const splitAtt = dataSplit.split('@');

        if (dataSplit.includes('NOTE')) {
          data.note = splitAtt[1].toLowerCase();
        }

        if (dataSplit.includes('CONFIRM')) {
          data.confirm = splitAtt[1].toLowerCase();
        }

        if (dataSplit.includes('TF')) {
          data.timeFrame = splitAtt[1].toLowerCase();
        }

        if (dataSplit.includes('NEWS')) {
          data.news = Number(splitAtt[1]);
        }
        if (dataSplit.includes('STATUS')) {
          data.status = splitAtt[1];
        }

        // TP, TPP, SL, Date
        if (dataSplit.includes('TP')) {
          if (dataSplit.includes('TPP')) {
            data.TP_Partial = Number(splitAtt[1]);
          } else {
            splitAtt.forEach((r) => {
              if (r.includes('TP')) {
              } else if (r.match(regAngka)) {
                allTp.push(r);
              }
            });
          }
        } else if (dataSplit.includes('SL')) {
          const slprice = Number(splitAtt[1]);
          dataSplit.includes('SL2')
            ? (data.stop_loss_2 = slprice)
            : (data.stop_loss = slprice);
        } else if (dataSplit.includes('DATE')) {
          let tgl = splitAtt[1];
          let date = getDateTime(parseDate(tgl));
          data.date = date.split(' ')[0];
          data.time = date.split(' ')[1];
        } else if (dataSplit.includes('TIME')) {
          data.time = splitAtt[1];
        }
      }
    }
  });

  // add TP pride to data

  if (allTp.length > 0) {
    allTp.map((item, i) => {
      let price = Number(item);
      data[`take_profit_${i + 1}`] = price;
    });
  }

  if (linkSS.length > 0) data.urlPic = linkSS;
  if (!data.account) data.account = messageForumName;

  return data;
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
    text: '/input\nhttps://i.imgur.com/SUoBTZR.png\nhttps://imgur.com/screenshot-SUoBTZR\n#GTR\nDate @ 20/05/2021 16:30\nnote @ Ini adalah note\nconfirm @ CB1 M5\nstatus @ running\ntf @ m15\nnews @ 3\nTTime @ 19:16\nXAUUSD sell now @ 2367\nwarning\nOther limit @ 2339\ntp : 2351\ntp   @ 2332\ntp 2333\ntp4@2334\ntpp : 2021\n\nTp5_________________2555\n\nSL @ 2377.88\nSL2 @ 2388',
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

//==================================================
// fn untuk mendapatkan format time yg benar
//==================================================
function getDateTime(date) {
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

  const formatted = dd + '/' + mm + '/' + yyyy + ' ' + HH + ':' + m;
  return formatted;
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

const dataku = {
  cmd: '',
  account: '',
  status: '',
  date: '',
  time: '',
  direction: '',
  isWarning: false,
  entry: '',
  entry2nd: '',
  take_profit_1: '',
  take_profit_2: '',
  take_profit_3: '',
  take_profit_4: '',
  take_profit_5: '',
  TP_Partial: '',
  stop_loss: '',
  stop_loss_2: '',
  news: '',
  confirm: '',
  note: '',
  timeFrame: '',
  urlPic: '',
};

const dataadaisinya = {
  cmd: '/INPUT',
  account: 'GTR',
  status: 'RUNNING',
  date: '20/05/2021',
  time: '19:16',
  direction: 'SELL NOW',
  isWarning: true,
  entry: 2367,
  entry2nd: 2339,
  TP_1: 2351,
  TP_2: 2332,
  TP_3: 2333,
  TP_4: 2334,
  TP_5: 2555,
  TP_Partial: 2021,
  stop_loss: 2377.88,
  stop_loss_2: 2388,
  news: 3,
  confirm: 'cb1 m5',
  note: 'ini adalah note',
  timeFrame: 'm15',
  urlPic: ['https://i.imgur.com/SUoBTZR.png', 'https://imgur.com/screenshot-SUoBTZR'],
};

const datakedua = {
  cmd: 'kosong',
  ...dataadaisinya,
  date: dataadaisinya.date !== '' ? `${dataadaisinya.date} ${dataadaisinya.time}` : '',
};

console.log(datakedua);
