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
  Created: new Date(),
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
  } else {
    const dateNow = new Date();

    const dataPesan = parseMessage(message);
    const dataFill = removeNullObj(dataPesan);
    const adaData = Object.keys(dataFill).length > 2;

    const data = {
      ...formatMessage,
      ...dataPesan,
      Date: dataPesan.Date ?? dateNow,
      ...dataAuto,
    };

    if (replyText) {
      let regID = /^#(.*\d+)/;
      let isDel = /(DEL|DEL)/i.test(textMessage);
      let isEdit = /(EDIT)/i.test(textMessage);
      let idFound = regID.test(replyText);

      let sheet = 'allDB';

      if (idFound && sheet) {
        let id = replyText.match(regID)[1];

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

              const getData = getDataById(id);
              if (getData.status == 'ok') {
                const dataFilter = removeNullObj(getData.data[0]);
                const kirimPesan = formatSendMessage(dataFilter);
                ctx.replyItWithHTML(kirimPesan);
              } else {
                ctx.replyIt(getData);
              }
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

          const kirimPesan = formatSendMessage(res);
          ctx.replyItWithHTML(kirimPesan);
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
