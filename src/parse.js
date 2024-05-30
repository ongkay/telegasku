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
    isWarning: false,
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
