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

function parseMessage3(message) {
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
function parseMessage4(message) {
  const dataPair = ['XAUUSD', 'USDJPY', 'USOIL', 'EURUSD', 'GBPJPY'];

  let messageText = message?.text ?? message;
  let messageForumName = message?.reply_to_message?.forum_topic_created?.name;

  console.log(messageText);
  const data = {
    cmd: null,
    Account: null,
    Status: null,
    Date: null,
    Time: null,
    Direction: null,
    isWarning: false,
    Entry: null,
    Entry_2: null,
    TP_1: null,
    TP_2: null,
    TP_3: null,
    TP_4: null,
    TP_5: null,
    TP_Half: null,
    SL: null,
    SL_2: null,
    News: null,
    Confirm: null,
    Note: null,
    Time_Frame: null,
    URL_Pic: null,
    Pair: null,
    DD_Price: null,
    Max_Price: null,
    Ref: null,
    BETP1: null,
    Efib_Level: null,
    Risk: null,
    Date_close: null,
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
    console.log(dataMessageText);
  } else {
    dataMessageText = [messageText];
  }
  console.log(dataMessageText[0].split('@')[1].trim());

  dataMessageText.forEach((el) => {
    console.log(el);
  });

  dataMessageText.forEach((el) => {
    // dataMessageText.forEach((el) => {
    const dataText = el.toUpperCase();

    console.log(dataText);

    if (el.match(regexUrl)) {
      linkSS.push(el);
    }

    if (dataText.includes('#')) {
      data.Account = dataText.split('#')[1];
    }
    if (!data.Pair) {
      if (dataText == 'XAUUSD' || dataText == 'GOLD') {
        data.Pair = 'XAUUSD';
      } else {
        dataPair.map((item) => {
          dataText.includes(item) ? (data.Pair = item) : '';
        });
      }
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

      if (dataSplit.includes('MAX')) {
        let dataEntry = dataSplit.match(regAngka)[0];
        data.Max_Price = Number(dataEntry);
      }

      if (dataSplit.includes('DD')) {
        let dataEntry = dataSplit.match(regAngka)[0];
        data.DD_Price = Number(dataEntry);
      }

      if (dataSplit.includes('ENTRY')) {
        let dataEntry = dataSplit.match(regAngka)[0];
        data.Entry = Number(dataEntry);
      }

      //Entry_2
      if (dataSplit.includes('OTHER') || dataSplit.includes('ENTRY2')) {
        const otherLimit = dataSplit.match(regAngka)[0];
        data.Entry_2 = Number(otherLimit);
      }

      // Direction
      if (dataSplit.includes('SELL')) {
        data.Direction = dataSplit.includes('LIMIT') ? 'SELL LIMIT' : 'SELL NOW';
        // let dataEntry = dataSplit.match(regAngka)[0];
        // data.Entry = Number(dataEntry);
      } else if (dataSplit.includes('BUY')) {
        data.Direction = dataSplit.includes('LIMIT') ? 'BUY LIMIT' : 'BUY NOW';
      }

      if (dataSplit.includes('@')) {
        const splitAtt = dataSplit.split('@');

        if (dataSplit.includes('BETP1')) {
          data.BETP1 = splitAtt[1];
        }

        if (dataSplit.includes('EFIB')) {
          data.Efib_Level = splitAtt[1];
        }

        if (dataSplit.includes('REF')) {
          data.Ref = splitAtt[1];
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
            data.TP_Half = Number(splitAtt[1]);
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
          dataSplit.includes('SL2') ? (data.SL_2 = slprice) : (data.SL = slprice);
        } else if (dataSplit.includes('DATE_CLOSE')) {
          let tgl = splitAtt[1];
          data.Date_close = getDateTime(parseDate(tgl));
        } else if (dataSplit.includes('DATE')) {
          let tgl = splitAtt[1];
          let Date = getDateTime(parseDate(tgl));
          data.Date = Date.split(' ')[0];
          data.Time = Date.split(' ')[1];
        } else if (dataSplit.includes('TIME')) {
          data.Time = splitAtt[1];
        }
      }
    }
  });

  // add TP pride to data

  if (allTp.length > 0) {
    allTp.map((item, i) => {
      let price = Number(item);
      data[`TP_${i + 1}`] = price;
    });
  }

  if (linkSS.length > 0) data.URL_Pic = linkSS;
  if (!data.Account) data.Account = messageForumName;

  return data;
}

function parseMessage(message) {
  const dataPair = ['XAUUSD', 'USDJPY', 'USOIL', 'EURUSD', 'GBPJPY'];

  let messageText = message?.text ?? message;
  let messageForumName = message?.reply_to_message?.forum_topic_created?.name;

  const data = {};

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
    dataMessageText = [messageText];
  }

  dataMessageText.forEach((el) => {
    const dataText = el.toUpperCase();

    if (el.match(regexUrl)) {
      linkSS.push(el);
    }

    if (dataText.includes('#')) {
      data.Account = dataText.split('#')[1];
    }
    if (!data.Pair) {
      if (dataText == 'XAUUSD' || dataText == 'GOLD') {
        data.Pair = 'XAUUSD';
      } else {
        dataPair.map((item) => {
          dataText.includes(item) ? (data.Pair = item) : '';
        });
      }
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
        data.Direction = dataSplit.includes('LIMIT') ? 'SELL LIMIT' : 'SELL NOW';
        let dataEntry = dataSplit.match(regAngka)[0];
        data.Entry = Number(dataEntry);
      } else if (dataSplit.includes('BUY')) {
        data.Direction = dataSplit.includes('LIMIT') ? 'BUY LIMIT' : 'BUY NOW';
        let dataEntry = dataSplit.match(regAngka)[0];
        data.Entry = Number(dataEntry);
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
            data.TP_Half = Number(splitAtt[1]);
          } else if (dataSplit.includes('TP1')) {
            data.TP_1 = Number(splitAtt[1]);
          } else if (dataSplit.includes('TP2')) {
            data.TP_2 = Number(splitAtt[1]);
          } else if (dataSplit.includes('TP3')) {
            data.TP_3 = Number(splitAtt[1]);
          } else if (dataSplit.includes('TP4')) {
            data.TP_4 = Number(splitAtt[1]);
          } else if (dataSplit.includes('TP5')) {
            data.TP_5 = Number(splitAtt[1]);
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
          dataSplit.includes('SL2') ? (data.SL_2 = slprice) : (data.SL = slprice);
        } else if (dataSplit.includes('DATE_CLOSE')) {
          let tgl = splitAtt[1];
          data.Date_close = getDateTime(parseDate(tgl));
        } else if (dataSplit.includes('DATE')) {
          let tgl = splitAtt[1];
          let Date = getDateTime(parseDate(tgl));
          data.Date = Date.split(' ')[0];
          data.Time = Date.split(' ')[1];
        } else if (dataSplit.includes('TIME')) {
          data.Time = splitAtt[1];
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
    text: '/input\nhttps://i.imgur.com/SUoBTZR.png\nhttps://imgur.com/screenshot-SUoBTZR\n#GTR\nDate @ 22/03 \nnote @ Ini adalah note\nconfirm @ CB1 M5\nstatus @ running\ntf @ m15\nnews @ 3\nXAUUSD sell now @ 2367\nwarning\nOther limit @ 2339\ntp : 2351\ntp   @ 2332\ntp 2333\ntp4@2334\ntpp : 2021\n\nTp5_________________2555\n\nSL @ 2377.88\nSL2 @ 2388',
    // text: 'fgfgfgfgfgfg',
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

const regEntry = /^(ENTRY|OTHER|SELL LIMIT|BUY LIMIT|SELL NOW|BUY NOW)/i;

const upperLine = 'sdf entry aja sdf';
const reg = upperLine.match(regEntry);

const regexCommand = /(DEL|EDIT|ed|Ed|del|Del|EDIT)/i;

let isDel = /(DEL|DEL)/i.test('ini adalah dellet');
let isEdit = /(EDIT)/i.test('ini adalah edit');
let idFound = /(id)/i.test('_ID textMessage');
console.log(isDel);
console.log(idFound);
