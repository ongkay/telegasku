// lumpia.DEBUG = true;
lumpia.verbose = true;

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

const dataAuto = {
  Session: null,
  RR: null,
  RRR: null,
  Lot_Size: null,
  Net_Profit: null,
  Net_Pips: null,
  Net_RR: null,
  ROI: null,
  Saldo: null,
  Created: getDateTime(new Date()),
};

bot.on('message', (ctx) => {
  // Explicit usage
  let debugText = ctx.update;
  let message = ctx.message;
  let textMessage = message.text;
  let chatId = message.chat.id;
  let replyText = message.reply_to_message?.text;
  let account = message?.reply_to_message?.forum_topic_created?.name;

  if (/(debug)/i.test(textMessage)) {
    console.log('ini adalah debug');
    ctx.replyIt(debugText);

    html_message = `
    < b > Bold text</b >
    <i>Italicized text</i>
    <a href="https://www.google.com">Link to Google</a>
    <blockquote>
    This is an example quote.
    </blockquote>`;

    ctx.replyIt(
      `<blockquote>penggunaan:\n<code>/sholat lokasi(kab/kota)</code>\n\ncontoh:\n<code>/sholat sleman</code>\n<a href='https://www.google.com'>Link to Google</a></blockquote>`,
      { parse_mode: 'HTML' }
    );
    // ctx.replyIt(html_message, { parse_mode: "HTML" })
  } else {
    const dateNow = getDateTime(new Date());

    const dataPesan = parseMessage(message);
    const dataFill = removeNullObj(dataPesan);
    const adaData = Object.keys(dataFill).length > 2;

    const data = {
      ...formatMessage,
      ...dataPesan,
      Date: dataPesan.Date ? `${dataPesan.Date} ${dataPesan.Time}` : dateNow,
      Time: !dataPesan.Time ? dateNow.split(' ')[1] : dataPesan.Time,
      ...dataAuto,
    };

    if (replyText) {
      let isDel = /(DEL|DEL)/i.test(textMessage);
      let isEdit = /(EDIT)/i.test(textMessage);
      let idFound = /(id)/i.test(replyText);

      let dataReplay = parseStringToObject(replyText);
      let sheet = dataReplay.account;

      if (idFound && sheet) {
        let id = replyText.match(/^_id : (.*)\n/)[1];

        // const getData = getDataById(id, account);

        if (isDel) {
          const res = deleteDataById(id, sheet);
          if (res.status == 'ok') {
            ctx.replyItWithHTML(`#<code>${id}</code>\n berhasil di hapus dari database`);
          } else {
            ctx.replyIt({ _id: id, ...res });
          }
        } else if (isEdit) {
          if (Object.keys(dataFill).length > 0) {
            const res = updateDataById(id, dataFill, sheet);

            if (res.status == 'ok') {
              console.log('res.data');
              console.log(res.data);

              const datakirim = parseObjToString(res.data);

              ctx.replyItWithHTML(
                `#<code>${id}</code>\n database berhasi di update\n---------------------\n${datakirim}`
              );
            } else {
              ctx.replyIt({ _id: id, ...res });
            }
          } else {
            ctx.replyIt('GAGAL EDIT id:' + id + ' karena datafill kurang dari 1');
          }
        } else {
          ctx.replyIt('Perintah replay hanya untuk edit atau delete database saja');
        }
      } else {
        ctx.replyIt('ID dan akun tidak di temukan, mungkin anda salah reply');
      }
    } else {
      if (adaData) {
        const input = inputData(data);

        if (input.status == 'ok') {
          const res = input.data;

          const datakirim = parseObjToString(input.data);
          ctx.replyItWithHTML(datakirim);

          let date = res.Date;
          let direction = res.Direction;
          let isWarning = res.isWarning;
          let id = res._id;
          let pair = res.Pair;
          let entry = res.Entry;
          let entry2 = res.Entry_2;
          let tp1 = res.TP_1;
          let tp2 = res.TP_2;
          let tp3 = res.TP_3;
          let tp4 = res.TP_4;
          let tp5 = res.TP_5;
          let sl = res.SL;
          let sl2 = res.SL_2;

          let riskPip1 = getCountPips(entry, sl, pair);
          let riskPip2 = sl2 ? getCountPips(entry, sl2, pair) : null;
          let tpPip1 = getCountPips(entry, tp1, pair);
          let tpPip2 = getCountPips(entry, tp2, pair);
          let tpPip3 = getCountPips(entry, tp3, pair);
          let tpPip4 = getCountPips(entry, tp4, pair);
          let tpPip5 = getCountPips(entry, tp5, pair);

          let loss1 = getCountProfit(riskPip1, 0.01, pair);
          let loss2 = getCountProfit(riskPip2, 0.01, pair);
          let win1 = getCountProfit(tpPip1, 0.01, pair);
          let win2 = getCountProfit(tpPip2, 0.01, pair);
          let win3 = getCountProfit(tpPip3, 0.01, pair);
          let win4 = getCountProfit(tpPip4, 0.01, pair);
          let win5 = getCountProfit(tpPip5, 0.01, pair);

          let winR1 = getRR(riskPip1, tpPip1);
          let winR2 = getRR(riskPip1, tpPip2, riskPip2);
          let winR3 = getRR(riskPip1, tpPip3, riskPip2);
          let winR4 = getRR(riskPip1, tpPip4, riskPip2);
          let winR5 = getRR(riskPip1, tpPip5, riskPip2);

          const kirimtele =
            `#<code>${id}</code>\n\n` +
            `${date}\n` +
            `${pair} ${direction} \n\n` +
            `Entry: <code>${entry}</code> ${isWarning ? '⚠️' : ''}\n` +
            `SL:      <code>${sl}</code> 👉 <code>${riskPip1} Pips</code>, <code>$${loss1}</code> \n` +
            `${
              tp2 ? 'TP1' : 'TP'
            }:   <code>${tp1}</code> 👉 <code>${tpPip1} Pips</code>, <code>${winR1}R</code>\n` +
            `${
              tp2
                ? `TP2:   <code>${tp2}</code> 👉 <code>${tpPip2} Pips</code>, <code>${winR2}R</code>\n`
                : ''
            }` +
            `${
              tp3
                ? `TP3:   <code>${tp3}</code> 👉 <code>${tpPip3} Pips</code>, <code>${winR3}R</code>\n`
                : ''
            }` +
            `${
              tp4
                ? `TP2:   <code>${tp4}</code> 👉 <code>${tpPip4} Pips</code>, <code>${winR4}R</code>\n`
                : ''
            }` +
            `${
              tp5
                ? `TP2:   <code>${tp5}</code> 👉 <code>${tpPip5}Pips</code>, <code>${winR5}R</code>\n`
                : ''
            }` +
            `\n---------------------------------`;
          // `${tp2 ? 'TP1' : 'TP'} : <code>${tp1}</code> [${tpPip1}Pips]$ ${win1}`

          ctx.replyItWithHTML(kirimtele);
        } else {
          ctx.replyIt(input);
        }
      } else {
        ctx.replyIt('Format yang anda masukkan salah');
      }
    }
  }
});

function handleUpdate2() {
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
      text: '/input\nhttps://i.imgur.com/SUoBTZR.png\nhttps://imgur.com/screenshot-SUoBTZR\n#GTR\nDate @ 20/05/2021 16:30\nnote @ Ini adalah note\nconfirm @ CB1 M5\nstatus @ running\ntf @ m15\nnews @ 3\nTTime @ 19:16\nXAUUSD sell now @ 2367\nwarning\nOther limit @ 2339\ntp : 2351\ntp   @ 2332\ntp 2333\ntp4@2334\ntpp : 2021\n\nTp5_________________2555\n\nSL @ 2377.88\nSL2 @ 2388 #GFT ',
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

  bot.handleUpdate(update);
}

// fungsi untuk memproses pesan user
function handleUpdateReplay() {
  let update = {
    update_id: 708507685,
    message: {
      message_id: 1436,
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
      date: 1717671201,
      message_thread_id: 7,
      reply_to_message: {
        message_id: 1431,
        from: {
          id: 7062989862,
          is_bot: true,
          first_name: 'jurnaltradeku',
          username: 'jurnaltradebot',
        },
        chat: {
          id: -1002065173361,
          title: 'Performa-Signal',
          is_forum: true,
          type: 'supergroup',
        },
        date: 1717670219,
        message_thread_id: 7,
        text: '_id @ wfr608536\nAccount @ WFR Analysis\nDate @ 25/04/2024 17:36\nTime @ 17:36\nDirection @ SELL NOW\nisWarning @ true\nEntry @ 2367\nTP_1 @ 2354\nTP_2 @ 2334\nTP_3 @ 2339\nSL @ 2377\nConfirm @ cb1 m30\nNote @ oke juga ini adalah note\nPair @ XAUUSD\nCreated @ Thu Jun 06 2024 17:36:57 GMT+0700 (Western Indonesia Time)',
        is_topic_message: true,
      },
      text: 'edit\nSL @ 454545454',
      is_topic_message: true,
    },
  };

  bot.handleUpdate(update);
}
