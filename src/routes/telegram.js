require('dotenv').config();
const express = require('express');
const router = express.Router();

const helper = require('../helpers')
const keyboard = require('../keyboard')
const text = require('../info-text')

const Database = require('../DB.js')

let database = new Database({
    host     : process.env.HOST,
    user     : process.env.db_USER,
    password : process.env.PASS,
    database : process.env.DB
})

database.query( 'SELECT * FROM telegram_users' ).then( rows => {
   console.log(rows);
}).catch( err => {
   console.log(err);
} );

const TelegramBot = require('node-telegram-bot-api');
const mysql = require("mysql2");
const bodyParser = require('body-parser')
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {polling: true});

//dialog from starting conversation
/*bot.on("text", (message) => {

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
});*/

//START command
/*bot.onText(/\/start/, function onLoveText(msg) {
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
});*/

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
//USER ENTERS CHAT
bot.onText(/\/start/, msg => {

    let option = {
        "parse_mode": "Markdown",
        "reply_markup": {
            "one_time_keyboard": true,
            "keyboard": [[{
                text: "Відправити мій номер телефону",
                request_contact: true,
                one_time_keyboard: true
            }]]
        }
    };

    bot.sendMessage(helper.getChatId(msg), `Для швидкої реєстрації тисни кнопку 'Відправити мій номер телефону'`, option)
        .then(() => {})
})

bot.on("contact",(msg)=>{
    bot.sendMessage(helper.getChatId(msg), `Головне меню`, {

        reply_markup: {
            inline_keyboard: keyboard.home
        }
    })
    let sql = `UPDATE telegram_users SET phone = '${msg.contact.phone_number}' WHERE chat_id = '${msg.chat.id}'`;
    connection.query(sql, function (err, result) {
        if(err) console.log(err);

        console.log(msg.contact.phone_number, msg.chat.id)
    });
});

bot.on('callback_query', query => {

    const data = query.data;
    const id = query.message.chat.id

    //bot.deleteMessage(id, query.message.message_id)

    console.log(query)

    switch (data) {
        case 'cabinet':
            bot.editMessageText( `Кабінет`, {
                chat_id : id,
                message_id: query.message.message_id,
                reply_markup: {
                    inline_keyboard: keyboard.cabinet
                }
            })
            break
        case 'info':
            bot.editMessageText( `Інформація`, {
                chat_id : id,
                message_id: query.message.message_id,
                reply_markup: {
                    inline_keyboard: keyboard.info
                }
            })
            break
        case 'payment':
            bot.editMessageText( `Оплата`, {
                chat_id : id,
                message_id: query.message.message_id,
                reply_markup: {
                    inline_keyboard: keyboard.payment
                }
            })
            break
        case 'delivery':
            bot.editMessageText( `Доставка`, {
                chat_id : id,
                message_id: query.message.message_id,
                reply_markup: {
                    inline_keyboard: keyboard.delivery
                }
            })
            break
        case 'delivery_nova':
            bot.editMessageText( text.delivery_nova, {
                chat_id : id,
                message_id: query.message.message_id,
                reply_markup: {
                    inline_keyboard: keyboard.delivery_back
                }
            })
            break
        case 'idostavka':
            bot.editMessageText( text.idostavka, {
                chat_id : id,
                message_id: query.message.message_id,
                reply_markup: {
                    inline_keyboard: keyboard.delivery_back
                }
            })
            break
        case 'operator':
            bot.editMessageText( `Оператор`, {
                chat_id : id,
                message_id: query.message.message_id,
                reply_markup: {
                    inline_keyboard: keyboard.operator
                }
            })
            break
        case 'home':
            bot.editMessageText( `Головне меню`, {
                chat_id : id,
                message_id: query.message.message_id,
                reply_markup: {
                    inline_keyboard: keyboard.home
                }
            })
            break
    }
});

module.exports = router;
