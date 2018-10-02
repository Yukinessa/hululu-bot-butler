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

bot.on('replyCommand', (chat, date, from, messageId, text, command, commandData, target) => {
  if (command === 'getname') {
    bot.sendText(chat.id, 'Target name: ' + target.first_name)
    return
  }

  if (command === 'spam') {
    bot.sendChatAction(chat.id, 'typing', (status) => {
      if (status.Error) {
        log.resMessage('error : ' + status.Error)
      } else {
        log.resMessage(target)
        bot.sendText(chat.id,'message id : '+target.username)
        bot.deleteMessage('140760747', messageId,(status)=>{
          if(status.Error){
            bot.sendText(chat.id,'error deleted')
            log.resMessage(messageId)
          }else{
            bot.sendText(chat.id,'message deleted')
          }
        })
        // bot.deleteMessage(targetChat, messageId, (error) => {
        //   if (error) {
        //     // Handle after error.
        //     return
        //   }
        //   // Handle after action success.
        // })
      }
    })
  }
})

log.resMessage(env.botName + ' on air')