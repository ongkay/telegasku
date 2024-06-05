// lumpia.DEBUG = true;
lumpia.verbose = true;

function statusFilled(pesan) {
  Logger.log('status gagal');
  Logger.log(pesan);

  return {
    status: 'filled',
    pesan,
  };
}

function statusSukses(data) {
  Logger.log('status sukses');
  return {
    status: 'ok',
    data,
  };
}

function generateId(name = '') {
  name = name.toLowerCase();
  if (name.match(/[^a-z]/g)) name = name.split(/[^a-z]/g)[0];

  // Generate random 6-digit number
  var randomNum = Math.floor(Math.random() * 900000) + 100000; // Ensure number starts with 2

  // var uniqueID = name + '-' + randomNum;
  var uniqueID = name + randomNum;

  return uniqueID;
}

bot.on('message', (ctx) => {
  // Explicit usage
  let message = ctx.message;
  let textMessage = message.text;
  let chatid = message.chat.id;
  let replyText = message.reply_to_message?.text;
  let accFromGrup = message?.reply_to_message?.forum_topic_created?.name;

  const dataPesan = parseMessage(message);
  const dataFill = removeNullObj(dataPesan);
  const adaData = Object.keys(dataFill).length > 0;

  const formatMessage = {
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

  const data = {
    ...dataPesan,
    Date: dataPesan.Date !== '' ? `${dataPesan.Date} ${dataPesan.Time}` : '',
    Session: null,
    RR: null,
    RRR: null,
    Lot_Size: null,
    Net_Profit: null,
    Net_Pips: null,
    Net_RR: null,
    ROI: null,
    Saldo: null,
    Created: new Date(),
  };

  function inputData(data) {
    const db = Dbsheet.init('1fqw7NyUXoW7tAeTjpaGqjnm7c804tW8iBKBeE2MZuE8');

    try {
      const akun = data.Account;

      const columns = [];
      mapObj(data, function (value, key) {
        columns.push(key);
      });

      db.createSheetIfNotExists(akun, columns);
      let userSheet = db.sheet(akun);

      // insert satu data
      userSheet.insert({
        _id: generateId(akun),
        ...data,
      });

      // users = userSheet.find()
      // Logger.log(users)

      return statusSukses(data);
    } catch (error) {
      return statusFilled(error.message);
    }
  }
  if (adaData) {
    const input = inputData(data);

    if (input.status == 'ok') {
      const inputSukses = removeNullObj(input.data);

      let balasPesan = [];
      mapObj(inputSukses, function (value, key) {
        balasPesan.push(`${key} @ ${value}\n`);
      });

      let dikirim = balasPesan.toString().replace(/,/g, '');

      ctx.replyIt(dikirim);
    } else {
      ctx.replyIt(input);
    }
  } else {
    ctx.replyIt(textMessage);
  }
});

function handleUpdate() {
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
function handleUpdate2() {
  let text1 = '/halo';

  let update = {
    update_id: 708507416,
    message: {
      message_id: 118,
      from: {
        id: 6770187132,
        is_bot: false,
        first_name: 'setiawan',
        username: 'ongtrade',
        language_code: 'en',
      },
      chat: {
        id: 6770187132,
        first_name: 'setiawan',
        username: 'ongtrade',
        type: 'private',
      },
      date: 1715496211,
      text: '/input\n#GGF\nXXAUUSD sell now @ 2367\ntp @ 2354\ntp2 @ 2334\n\nSL @ 2377',
      entities: [{ offset: 0, length: 6, type: 'bot_command' }],
    },
  };

  bot.handleUpdate(update);
}
