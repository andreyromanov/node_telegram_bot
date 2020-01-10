const TelegramBot = require('node-telegram-bot-api');

const TOKEN = '1005375475:AAHF25XkUu3SpqyjvrYyKxcdZQBqod2YMfE';

const bot = new TelegramBot(TOKEN, {polling: true});

bot.on('message', msg => {
	bot.sendMessage(msg.chat.id, `Привет, ${msg.from.first_name}!`)
})