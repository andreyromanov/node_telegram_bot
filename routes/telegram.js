require('dotenv').config();
const express = require('express');
const router = express.Router();

const TelegramBot = require('node-telegram-bot-api');

const mysql = require("mysql2");


const bodyParser = require('body-parser')


const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {polling: true});

const connection = mysql.createConnection({
  host: "localhost",
  user: "admin",
  database: "Message_db",
  password: "uatao"
});

//dialog from starting conversation
bot.on("text", (message) => {

    const connection = mysql.createConnection({
        host: "localhost",
        user: "admin",
        database: "Message_db",
        password: "uatao"
    });

    connection.connect(function(err) {
        if (err) throw err;
        connection.query(`SELECT * FROM dialogs`, function (err, result, fields) {
            if (err) throw err;
            result.forEach(function (arrayItem) {
                if(message.text.toLowerCase().includes(arrayItem.key)) {
                    bot.sendMessage(message.chat.id, arrayItem.answer);
                }
            });
        });
    });
});

//START command
bot.onText(/\/start/, function onLoveText(msg) {
  bot.sendMessage(msg.chat.id, 'Добро пожаловать в компанию!');

  let sql = `INSERT INTO telegram_users (chat_id, first_name, last_name, language)
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

//PHONE command
bot.onText(/\/phone/, function (msg, match) {
    let option = {
        "parse_mode": "Markdown",
        "reply_markup": {
            "one_time_keyboard": true,
            "keyboard": [[{
                text: "Отправть номер телефона",
                request_contact: true,
                one_time_keyboard: true
            }], ["Отменить"]]
        }
    };
    bot.sendMessage(msg.chat.id, "Номер позволит получать больше информации", option).then(() => {})
});

bot.on("contact",(msg)=>{

    let sql = `UPDATE telegram_users SET phone = '${msg.contact.phone_number}' WHERE chat_id = '${msg.chat.id}'`;
      connection.query(sql, function (err, result) {
        if(err) console.log(err);
        bot.sendMessage(msg.chat.id, "Спасибо :-)");
        console.log(msg.contact.phone_number, msg.chat.id)
      });
});

//получение внешних запросов
router.get('/', async (req,res) => {
    bot.sendMessage('391175023', `Внешний запрос`);
    res.send('Hello World!')
    console.log('внешний')
});

//send info to users
router.post('/', async (req,res) => {
//create new connection
  const connection = mysql.createConnection({
    host: "localhost",
    user: "admin",
    database: "Message_db",
    password: "uatao"
  });
//get data from request to variable
    let keyName1 = req.body;
    //console.log(typeof keyName1)
    keyName1.forEach(function(item, value){
      connection.connect(function(err) {
      if (err) throw err;
        connection.query(`SELECT * FROM telegram_users WHERE phone = '${keyName1[value]["phone"]}'`, function (err, result, fields) {
          if (err) throw err;
          //console.log(result)
          if(result[0] != null){
            bot.sendMessage(result[0].chat_id, keyName1[value]["text"])
            //console.log(result[0].id);
          }
        });
      });
    });
//send response to server
    res.send('posted')
});

module.exports = router;
