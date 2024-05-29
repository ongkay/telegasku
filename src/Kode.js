const token = '7062989862:AAHuJu1M-AuGHe614y-7X6iC9im9V8bCXfA'

const bot = new lumpia.init(token)
bot.options.log_id = '6770187132'

// ini adalah editan dari vscode

// handle komunikasi via POST dari Telegram ke (webhook) GAS
function doPost(e) {
  bot.doPost(e)
}

function setWebhook() {
  let url =
    'https://script.google.com/macros/s/AKfycbxeOeFauBWNfXyZd5_dnrT4Wycfjt7YbcuMQsHx1EAMZRDzlcWkeBjlakr4QGACxtCGhA/exec'
  let result = bot.telegram.setWebhook(url)
  Logger.log(result)
}

// handle untuk user yang mengetik /ping
bot.cmd('ping', (ctx) => ctx.replyIt('Pong!'))

function getmi() {
  let result = bot.telegram.getMe()
  Logger.log(result)
}
