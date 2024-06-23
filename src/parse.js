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
