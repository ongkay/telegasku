// lumpia.DEBUG = true;
lumpia.verbose = true

function testUser() {
  Logger.log('semua data fineOne')
}

bot.on('message', (ctx) => {
  // Explicit usage
  let message = ctx.message
  let textMessage = message.text
  let chatid = message.chat.id
  let replyText = message.reply_to_message?.text
  let accFromGrup = message?.reply_to_message?.forum_topic_created?.name

  let data = parseMessage(message)

  // ctx.replyIt(data)

  function testUser(data) {
    var db = Dbsheet.init('1fqw7NyUXoW7tAeTjpaGqjnm7c804tW8iBKBeE2MZuE8')

    let akun = data.account
    let dataFill = removeNullObj(data)

    let columns = []
    Logger.log(akun)

    mapObj(dataFill, function (value, key) {
      columns.push(key)
    })

    Logger.log(columns)

    db.createSheetIfNotExists(akun, columns)
    let userSheet = db.sheet(akun)

    // insert satu data
    userSheet.insert(dataFill)

    users = userSheet.find()
    Logger.log('semua data fineOne')
    Logger.log(users)
  }

  testUser(data)
})

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
  }

  bot.handleUpdate(update)
}

// fungsi untuk memproses pesan user
function handleUpdate2() {
  let text1 = '/halo'

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
  }

  bot.handleUpdate(update)
}
