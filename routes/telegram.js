require('dotenv').config();
const express = require('express');
const router = express.Router();

const TelegramBot = require('node-telegram-bot-api');
const mysql = require("mysql2");

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {polling: true});


// Matches /start

const connection = mysql.createConnection({
  host: "localhost",
  user: "admin",
  database: "bot_db",
  password: "uatao"
});


bot.onText(/\/start/, function onLoveText(msg) {
  bot.sendMessage(msg.chat.id, 'Добро пожаловать в компанию!');

  var sql = `INSERT INTO telegram_users (chat_id, first_name, last_name, language)
                                 VALUES (${msg.from.id}, '${msg.from.first_name}', '${msg.from.last_name}', '${msg.from.language_code}')`;
	  connection.query(sql, function (err, result) {
      if(err)
      {

        if(err.code == 'ER_DUP_ENTRY' || err.errno == 1062)
        {
            console.log('Here you can handle duplication')
        }
        else{
           console.log(err)
        }

      }else{
         console.log('Inserted 1 row')
      }
	  });

  console.log(msg.chat.id)
});

/*bot.on('message', msg => {
	bot.sendMessage(msg.chat.id, `Привет, ${msg.from.first_name}!`);
	//console.log(msg);

});*/

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

//добавление телефона пользователя
/*bot.onText(/\/phone/, function onLoveText(msg) {

  var sql = `INSERT INTO telegram_users (chat_id, first_name, last_name, language)
                                 VALUES (${msg.from.id}, '${msg.from.first_name}', '${msg.from.last_name}', '${msg.from.language_code}')`;
	  connection.query(sql, function (err, result) {
      if(err)
      {
        if(err.code == 'ER_DUP_ENTRY' || err.errno == 1062)
        {
            console.log('Here you can handle duplication')
        }
        else{
           console.log(err)
        }
      }else{
         bot.sendMessage(msg.chat.id, 'Номер телефона успешно добавлен!');
      }
	  });

  console.log(msg.chat.id)
});*/

bot.onText(/\/phone/, function (msg, match) {
    var option = {
        "parse_mode": "Markdown",
        "reply_markup": {
            "one_time_keyboard": true,
            "keyboard": [[{
                text: "Отправть номер телефона",
                request_contact: true
            }], ["Отменить"]]
        }
    };

    bot.sendMessage(msg.chat.id, "Номер позволит получать больше информации", option).then(() => {})

});

bot.on("contact",(msg)=>{

    var sql = `UPDATE telegram_users SET phone = '${msg.contact.phone_number}' WHERE chat_id = '${msg.chat.id}'`;
      connection.query(sql, function (err, result) {
        if(err) console.log(err)
        bot.sendMessage(msg.chat.id, "Спасибо :-)")
        console.log(msg.contact.phone_number, msg.chat.id)
      });

})

//получение внешних запросов
router.get('/', async (req,res) => {
    bot.sendMessage('391175023', `Внешний запрос`)
    res.send('Hello World!')
    console.log('внешний')
});

router.post('/', async (req,res) => {
    var keyName1 = req.body;

    keyName1.forEach(function(item, value){
      console.log(keyName1[value]["phone"])
      console.log('--------------------')
    });

    res.send('posted')
});

//bot.sendMessage('391175023', "by id")

module.exports = router;
