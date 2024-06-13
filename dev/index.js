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

    if (dataSplit.includes('/INPUT') || dataSplit.includes('/EDIT') || dataSplit.includes('/DEL')) {
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
        dataSplit.includes('SL2') ? (data.stop_loss_2 = slprice) : (data.stop_loss = slprice);
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

    if (dataText.includes('/INPUT') || dataText.includes('/EDIT') || dataText.includes('/DEL')) {
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
          dataSplit.includes('SL2') ? (data.stop_loss_2 = slprice) : (data.stop_loss = slprice);
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

    if (dataText.includes('/INPUT') || dataText.includes('/EDIT') || dataText.includes('/DEL')) {
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
      if (/(gold|xau)/i.test(dataText)) {
        data.Pair = 'XAUUSD';
      } else {
        dataPair.map((item) => {
          dataText.includes(item) ? (data.Pair = item) : '';
        });
      }
    }

    if (/\/(INPUT|EDIT|DEL)/i.test(dataText)) {
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
        const isLimit = dataSplit.includes('LIMIT');
        const isStop = dataSplit.includes('STOP');
        data.Direction = isLimit ? 'SELL LIMIT' : isStop ? 'SELL STOP' : 'SELL NOW';
        let dataEntry = dataSplit.match(regAngka)[0];
        data.Entry = Number(dataEntry);
      } else if (dataSplit.includes('BUY')) {
        const isLimit = dataSplit.includes('LIMIT');
        const isStop = dataSplit.includes('STOP');
        data.Direction = isLimit ? 'SELL LIMIT' : isStop ? 'SELL STOP' : 'SELL NOW';
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
    text: '/input\nhttps://i.imgur.com/SUoBTZR.png\nhttps://imgur.com/screenshot-SUoBTZR\n#GTR\nDate @ 22/03 \nnote @ Ini adalah note\nconfirm @ CB1 M5\nstatus @ running\ntf @ m15\nnews @ 3\nGold sell limit @ 2367\nwarning\nOther limit @ 2339\ntp : 2351\ntp   @ 2332\ntp 2333\ntp4@2334\ntpp : 2021\n\nTp5_________________2555\n\nSL @ 2377.88\nSL2 @ 2388',
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

function getRR(risk1, reward, risk2 = null) {
  let risk = 1;

  if (risk2) {
    let riskPlus = risk2 / risk1;
    risk = Math.round(Math.abs(riskPlus) * 10) / 10;
  }
  let r = Math.round(Math.abs(reward / risk1) * 10) / 10;
  return `${risk}:${r}`;
}

console.log(getRR(25, 63, 28));
console.log(getCountPips(2340, 2337.5));
console.log(getCountProfit(getCountPips(2253.38, 2278.04)));

const angka = 25.877878745;
const bulat = Math.round(angka * 100) / 100; // 2angka setelah koma

console.log(bulat);

function getCountDollars(entry, tpOrSl, pair = 'XAUUSD', lotSize) {
  pair = pair.toLowerCase();
  let pips = getCountPips(entry, tpOrSl, pair);

  !lotSize ? (lotSize = 0.01) : null;

  const data = dataPair[pair];
  let res = pips * lotSize * data.price;
  return Math.round(res * 100) / 100;
}

function getAlltWinLose({ pair, entry, sl, tp1, tp2, tp3, tp4, tp5, lotSize, sl2 }) {
  const res = {};
  const resFormat = {
    pipsSl: null,
    pipsSl2: null,
    pipsTp1: null,
    pipsTp2: null,
    pipsTp3: null,
    pipsTp4: null,
    pipsTp5: null,
    dollarSl: null,
    dollarSl2: null,
    dollarTp1: null,
    dollarTp2: null,
    dollarTp3: null,
    dollarTp4: null,
    dollarTp5: null,
    rrTp1: null,
    rrTp2: null,
    rrTp3: null,
    rrTp4: null,
    rrTp5: null,
  };

  // pips
  sl ? (res.pipsSl = getCountPips(entry, sl, pair)) : null;
  sl2 ? (res.pipsSl2 = getCountPips(entry, sl2, pair)) : null;
  tp1 ? (res.pipsTp1 = getCountPips(entry, tp1, pair)) : null;
  tp2 ? (res.pipsTp2 = getCountPips(entry, tp2, pair)) : null;
  tp3 ? (res.pipsTp3 = getCountPips(entry, tp3, pair)) : null;
  tp4 ? (res.pipsTp4 = getCountPips(entry, tp4, pair)) : null;
  tp5 ? (res.pipsTp5 = getCountPips(entry, tp5, pair)) : null;

  //dollar
  sl ? (res.dollarSl = getCountDollars(entry, sl, pair, lotSize)) : null;
  sl2 ? (res.dollarSl2 = getCountDollars(entry, sl2, pair, lotSize)) : null;
  tp1 ? (res.dollarTp1 = getCountDollars(entry, tp1, pair, lotSize)) : null;
  tp2 ? (res.dollarTp2 = getCountDollars(entry, tp2, pair, lotSize)) : null;
  tp3 ? (res.dollarTp3 = getCountDollars(entry, tp3, pair, lotSize)) : null;
  tp4 ? (res.dollarTp4 = getCountDollars(entry, tp4, pair, lotSize)) : null;
  tp5 ? (res.dollarTp5 = getCountDollars(entry, tp5, pair, lotSize)) : null;

  // RR
  res.pipsTp1 ? (res.rrTp1 = getRR(res.pipsSl, res.pipsTp1, res.pipsSl2)) : null;
  res.pipsTp2 ? (res.rrTp2 = getRR(res.pipsSl, res.pipsTp2, res.pipsSl2)) : null;
  res.pipsTp3 ? (res.rrTp3 = getRR(res.pipsSl, res.pipsTp3, res.pipsSl2)) : null;
  res.pipsTp4 ? (res.rrTp4 = getRR(res.pipsSl, res.pipsTp4, res.pipsSl2)) : null;
  res.pipsTp5 ? (res.rrTp5 = getRR(res.pipsSl, res.pipsTp5, res.pipsSl2)) : null;

  return res;
}

const tesgettWinLose = getAlltWinLose({
  entry: 2367,
  sl: 2377,
  sl2: 2379,
  tp1: 2354,
  tp2: 2334,
  tp3: 2339,
  pair: 'XAUUSD',
});

console.log(tesgettWinLose);

let datakuahj = 257.5454545;
console.log(Math.round(datakuahj * 10) / 10);

let regID = /^#(.*\d+)/;
let replyText = `#gf106445455\n

#satuduatiga`;
let idFound = regID.test(replyText);
let id = replyText.match(regID)[1];
console.log(id);
console.log(idFound);

function removePropertiesObj(object, namePropertyArray) {
  // Use a for loop to iterate through the properties to remove
  for (const property of namePropertyArray) {
    if (object.hasOwnProperty(property)) {
      delete object[property];
    }
  }
  return object;
}

// Example usage
const formatMessage = {
  cmd: null,
  Pair: null,
  Account: null,
  Status: null,
  Date: null,
  Time: null,
  Direction: null,
  isWarning: null,
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
  DD_Price: null,
  Max_Price: null,
  Ref: null,
  BETP1: null,
  Efib_Level: null,
  Risk: null,
  Date_close: null,
};

const propertiesToRemove = ['Pair'];

const formattedMessage = removePropertiesObj(formatMessage, propertiesToRemove);

console.log(formattedMessage); // Contains only the remaining properties

const removeStringNullObj = (obj) => {
  return Object.keys(obj).reduce((acc, current) => {
    if (obj[current] !== '' && obj[current] !== null) {
      return { ...acc, [current]: obj[current] };
    }
    return acc;
  }, {});
};

const datakusjs = {
  nama: 'kamu',
  siapa: null,
  dimana: null,
};

console.log(removeStringNullObj(datakusjs));
