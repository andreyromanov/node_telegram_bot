require('dotenv').config();
const express = require('express');
const router = express.Router();

const TelegramBot = require('node-telegram-bot-api');
const mysql = require("mysql2");

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {polling: true});


bot.on('message', msg => {
	bot.sendMessage(msg.chat.id, `Привет, ${msg.from.first_name}!`)

	/*var sql = `INSERT INTO telegram_users (chat_id, user) VALUES (${msg.from.id}, '${msg.from.first_name}')`;
	  connection.query(sql, function (err, result) {
	    if (err) throw err;
	    console.log("1 record inserted");
	  });*/

	 

});

// Matches /love
bot.onText(/\/love/, function onLoveText(msg) {
  const opts = {
    reply_to_message_id: msg.message_id,
    reply_markup: JSON.stringify({
      keyboard: [
        ['Yes, you are the bot of my life ❤'],
        ['No, sorry there is another one...']
      ]
    })
  };
  bot.sendMessage(msg.chat.id, 'Do you love me?', opts);
});


router.get('/', async (req,res) => {
    bot.sendMessage(msg.chat.id, `Привет, ${msg.from.first_name}!`)
});

module.exports = router;