process.env.NTBA_FIX_319 = 1;
const TelegramBot = require('node-telegram-bot-api');
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "admin",
  database: "bot_db",
  password: "uatao"
});




const TOKEN = '1046316934:AAEp6Uy9xiKoI0KpYfRb3cQnX_a-VjfNSCA';

const bot = new TelegramBot(TOKEN, {polling: true});

bot.on('message', msg => {
	bot.sendMessage(msg.chat.id, `Привет, ${msg.from.first_name}!`)

	var sql = `INSERT INTO telegram_users (chat_id) VALUES (${msg.from.id}) ON DUPLICATE KEY UPDATE
    chat_id = ${msg.from.id}`;
	  connection.query(sql, function (err, result) {
	    if (err) throw err;
	    console.log("1 record inserted");
	  });

})

//bot.sendMessage(391175023, `Завелся ботик`)
