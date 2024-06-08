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
