require('dotenv').config();
const express = require('express');
const router = express.Router();

const TelegramBot = require('node-telegram-bot-api');
const mysql = require("mysql2");
const bodyParser = require('body-parser')
//polling
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {polling: true});

//webhook
/*const url = 'https://18c8cca0740c.ngrok.io/posts';
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN);
bot.setWebHook(`${url}/bot${process.env.TELEGRAM_TOKEN}`);
// We are receiving updates at the route below!
router.post(`/bot${process.env.TELEGRAM_TOKEN}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});*/
//webhook

const helper = require('../helpers')
const keyboard = require('../keyboard')

const knex = require('knex')({
    client: 'mysql',
    connection: {
        host : process.env.HOST,
        user : process.env.db_USER,
        password : process.env.PASS,
        database : process.env.DB
    }
});

const NodeCache = require( "node-cache" );
const myCache = new NodeCache();

/*const Database = require('../DB.js')

let database = new Database({
    host     : process.env.HOST,
    user     : process.env.db_USER,
    password : process.env.PASS,
    database : process.env.DB
})*/

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
    console.log('внешний')
});

//send info to users
router.post('/', async (req,res) => {
    console.log(req.headers);

//create new connection
    /*database.query( 'SELECT * FROM telegram_users' )
        .then( rows => {
            console.log(rows);
        })
        .catch( err => console.log(err) );*/
//get data from request to variable
    let keyName1 = req.body;
    //console.log(typeof keyName1)
    keyName1.forEach(function(item, value){

        database.query(`SELECT * FROM telegram_users WHERE phone = '${keyName1[value]["phone"]}'`, function (err, result, fields) {
          if (err) throw err;
          console.log(result)
          if(result[0] != null){
            bot.sendMessage(result[0].chat_id, keyName1[value]["text"])
            console.log(result[0].id);
          }
        });

        database.query( `SELECT * FROM telegram_users WHERE phone = '${keyName1[value]["phone"]}'` )
            .then( rows => {
                console.log('new',rows);
            })
            .catch( err => console.log(err) );

    });
//send response to server
    res.send('posted')
});

//USER ENTERS CHAT
bot.on("text", msg => {
    let { text } = msg;

    if (/\/start/.test(text)){
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

    } else if(/\/menu/.test(text)){
        bot.sendMessage(helper.getChatId(msg), `Головне меню`, {
            reply_markup: {
                inline_keyboard: keyboard.home
            }
        })
    } else {
        //may be removed
        console.log(msg.message_id, msg.chat.id)
        bot.deleteMessage(msg.chat.id, msg.message_id)
    }

});

bot.on('polling_error', (error) => {
    //console.log(error);  // => 'EFATAL'
});

bot.on("contact",(msg)=>{
    bot.sendMessage(helper.getChatId(msg), `Дякую!`, {
        reply_markup: {
            remove_keyboard: true
        }
    }).then(()=>{
        bot.sendMessage(helper.getChatId(msg), `Головне меню`, {
            reply_markup: {
                inline_keyboard: keyboard.home
            }
        })
    })

    /*let sql = `UPDATE telegram_users SET phone = '${msg.contact.phone_number}' WHERE chat_id = '${msg.chat.id}'`;
    connection.query(sql, function (err, result) {
        if(err) console.log(err);

        console.log(msg.contact.phone_number, msg.chat.id)
    });*/
});

bot.on('callback_query', async query => {
    console.log('callback')
    const { data } = query;
    const { id } = query.message.chat;

if(data !== 'operator' && data !== 'home'){

    let menu;
    let keys = [];

    if(myCache.has( "menu" )){
        menu = myCache.get( "menu" )
        console.log('cache')
    } else{
        menu = await knex('menu_items')
            .where('menu_id',2)
            .then(rows => {
                myCache.set( "menu", rows, 12000 )
                console.log('database')
                return rows;
            }).catch( err => console.log(err) );
    }

    for(let btn of menu){
        if(btn.parent_id == data){
            keys.push([{
                text: btn.title,
                callback_data: btn.id
            }])
        }  else if(!btn.parent_id && btn.id != data && data == 'info'){
            keys.push([{
                text: btn.title,
                callback_data: btn.id
            }])
        }
    }
    let parent = menu.find(x => x.id == data)

    if(parent === undefined){
        keys.push([
            {
                text: 'Назад',
                callback_data: 'home'
            }
        ])
    } else if(parent.parent_id == null){
        keys.push([
            {
                text: 'Назад',
                callback_data: 'info'
            },
            {
                text: 'Головна',
                callback_data: 'home'
            }
        ])
    } else {
        keys.push([
            {
                text: 'Назад',
                callback_data: parent.parent_id
            },
            {
                text: 'Головна',
                callback_data: 'home'
            }
        ])
    }

    let text = data === 'info' ? 'Обери, що тебе цікавить:' : menu.find(x => x.id == data)

    bot.deleteMessage(id, query.message.message_id)
    bot.sendMessage(id, text.text || text, {
        reply_markup: {
            inline_keyboard: keys
        }
    })
}
    switch (data) {
        case 'operator':
            bot.editMessageText( `Перейдіть для звя'зку з оператором: @uatao_bot`, {
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

/*
knex('menu_items')
    .where('menu_id',2)
    .then(rows => {
        let data = rows;
        console.log('запрос в бд')

        bot.on('callback_query',  async query => {
            console.log('callback')
            const { data } = query;
            const { id } = query.message.chat;

            if(data !== 'operator' && data !== 'home'){

                bot.deleteMessage(id, query.message.message_id)

                let keys = [];

                for(let btn of rows){
                    if(btn.parent_id == data){
                        keys.push([{
                            text: btn.title,
                            callback_data: btn.id
                        }])
                    }  else if(!btn.parent_id && btn.id != data && data == 'info'){
                        keys.push([{
                            text: btn.title,
                            callback_data: btn.id
                        }])

                    }
                }
                let parent = rows.find(x => x.id == data)
                if(parent === undefined){
                    keys.push([
                        {
                            text: 'Назад',
                            callback_data: 'home'
                        }
                    ])
                } else if(parent.parent_id == null){
                    keys.push([
                        {
                            text: 'Назад',
                            callback_data: 'info'
                        },
                        {
                            text: 'Головна',
                            callback_data: 'home'
                        }
                    ])
                } else {
                    keys.push([
                        {
                            text: 'Назад',
                            callback_data: parent.parent_id
                        },
                        {
                            text: 'Головна',
                            callback_data: 'home'
                        }
                    ])
                }

                let text = data === 'info' ? 'Обери, що тебе цікавить:' : rows.find(x => x.id == data)

                bot.sendMessage(id,  text.text || text, {
                    reply_markup: {
                        inline_keyboard: keys
                    }
                })
            }
            switch (data) {
                case 'operator':
                    bot.editMessageText( `Перейдіть для зв'зку з оператором: @uatao_bot`, {
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

    }).catch( err => console.log(err) );
*/

module.exports = router;
