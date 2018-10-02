/**
 * load environment variable from
 */
const env = require('./env')

/**
 * @param {require} local_modules
 */
const log = require('./module/log')

/**
 * @param {required} node_modules
 */
const TelegramBot = require('telegram-bot-nova')

/**
 * @define {bot}
 */
var bot = new TelegramBot(env.token)

function onTyping(chat_id, callback) {
  bot.sendChatAction(chat_id, 'typing', (err) => {
    if (err) {
      log.resMessage(err);
    } else {
      callback()
    }
  })
}

const textToMember = {
  join: function (username) {
    return 'welcome to the jungle @' + username // + 'something else'
  },

  leave: function (username) {
    return 'bye-bye @' + username // + 'something else'
  }
}

// Logic Start Here.. -------------------------------------------------------

bot.on('command', (chat, date, from, messageId, text, command, commandData) => {
  if (command === 'start') {
    bot.sendChatAction(chat.id, 'typing', (status) => {
      if (status.Error) {
        log.resMessage('error : ' + status.Error)
      } else {
        bot.sendText(chat.id, env.started)
        log.resMessage('start by : '+chat.id)  
        log.resMessage('bot name : '+env.botName)  
      }
    });
    return
  }

})

bot.on('groupJoin', (chat, date, joiningUser, messageId, triggeringUser) => {
  onTyping(chat.id);
  bot.sendText(
    chat.id, textToMember.join(joiningUser.username)
  );
  return
})

bot.on('groupLeft', (chat, date, leavingUser, messageId, triggeringUser) => {
  onTyping(chat.id);
  bot.sendText(
    chat.id, textToMember.leave(leavingUser.username)
  );
  return
})

log.resMessage(env.botName + ' on air')