require('dotenv').config();
const express = require('express');
const router = express.Router();

const helper = require('../helpers')
const keyboard = require('../keyboard')
const kb = require('../keyboard-buttons')

/*const Telegraf = require('telegraf')
const Composer = require('telegraf/composer')
const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const Markup = require('telegraf/markup')
const WizardScene = require('telegraf/scenes/wizard')
const Scene = require('telegraf/scenes/base')

// Handler factoriess
const { enter, leave } = Stage;

const stepHandler = new Composer()*/
/*
stepHandler.action('next', (ctx) => {
    ctx.reply('Step 2. Via inline button')
    return ctx.wizard.next()
})
stepHandler.command('next', (ctx) => {
    ctx.reply('Step 2. Via command')
    return ctx.scene.leave()
})
stepHandler.use((ctx) => ctx.replyWithMarkdown('Press `Next` button or type /next'))

const superWizard = new WizardScene('super-wizard',
    (ctx) => {
        ctx.reply('Step 1', Markup.inlineKeyboard([
            Markup.callbackButton('Доставка️', 'next'),
            Markup.callbackButton('Оплата', 'next')
        ]).extra())
        return ctx.wizard.next()
    },
    stepHandler,
    (ctx) => {
        ctx.reply('Step 3', Markup.inlineKeyboard([
            Markup.urlButton('❤️', 'http://telegraf.js.org'),
            Markup.callbackButton('➡️ Next', 'next')
        ]).extra())
        return ctx.wizard.next()
    },
    (ctx) => {
        ctx.reply('Step 4')
        return ctx.wizard.next()
    },
    (ctx) => {
        ctx.reply('Done')
        return ctx.scene.leave()
    }
)
*/
/*
// Greeter scene
const greeterScene = new Scene('greeter')
greeterScene.enter((ctx) => ctx.reply('Hi'))
greeterScene.leave((ctx) => ctx.reply('Bye'))
greeterScene.hears('hi', enter('greeter'))
greeterScene.on('message', (ctx) => ctx.replyWithMarkdown('Send `hi`'))

// Echo scene
const echoScene = new Scene('echo')
echoScene.enter((ctx) => ctx.reply('echo scene'))
echoScene.leave((ctx) => ctx.reply('exiting echo scene'))
echoScene.command('back', leave())
echoScene.on('text', (ctx) => ctx.reply(ctx.message.text))
echoScene.on('message', (ctx) => ctx.reply('Only text messages please'))

const bot = new Telegraf(process.env.TELEGRAM_TOKEN)
const stage = new Stage([greeterScene, echoScene], { ttl: 10 })
bot.use(session())
bot.use(stage.middleware())
bot.command('greeter', (ctx) => ctx.scene.enter('greeter'))
bot.command('echo', (ctx) => ctx.scene.enter('echo'))
bot.on('message', (ctx) => ctx.reply('Try /echo or /greeter'))



//const stage = new Stage([contactDataWizard], { default: 'super-wizard' })

bot.use(session())
bot.use(stage.middleware())
bot.launch()



bot.startPolling()
*/

const Database = require('../DB.js')

let database = new Database({
    host     : process.env.HOST,
    user     : process.env.db_USER,
    password : process.env.PASS,
    database : process.env.DB
})


//database.query( 'SELECT * FROM telegram_users' ).then( rows => {
//    console.log(rows);
//}).catch( err => {
//    console.log(err);
//} );

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


/*bot.on('message', (msg) => {
    const {id} = msg.chat

    const html = `<strong>Hello, ${msg.from.first_name}</strong><pre>dsf sdfsdfsdf sdf sdfs</pre>`;

    const markdown = `*Hello, ${msg.from.first_name}* _Italic text_`;
    /!*setTimeout(()=>{
        bot.sendMessage(id, `https://ua-tao.com/`)
    }, 4000)*!/

    if(msg.text === 'Закрыть'){
        bot.sendMessage(id, 'Closing', {
            reply_markup:{
                remove_keyboard: true
            }
        })
    } else if (msg.text === 'Ответить') {
        bot.sendMessage(id, 'Closing', {
            reply_markup:{
                force_reply: true
            }
        })
    } else {
        bot.sendMessage(id, `Keyboard`, {
            reply_markup: {
                keyboard: [
                    ['Ответить', 'Закрыть'],
                    ['Отправить контакт']
                ],
                one_time_keyboard: true
            }
        })
    }


});*/

/*bot.on('message', (msg) => {
    switch (msg.text) {
        case kb.home.delivery:
            bot.sendMessage(helper.getChatId(msg), `Доставка`, {
                reply_markup: {
                    keyboard: keyboard.delivery
                }
            })
            break
        case kb.home.payments:
            break
        case kb.home.website:
            break
        case kb.back:
            bot.sendMessage(helper.getChatId(msg), `Головне меню`, {
                reply_markup: {
                    keyboard: keyboard.home
                }
            })
            break
    }
});*/

bot.onText(/\/start/, msg => {
    console.log(keyboard.payment)
    bot.sendMessage(helper.getChatId(msg), `Головне меню`, {

        reply_markup: {
            inline_keyboard: keyboard.home
        }
    })
})

bot.on('callback_query', query => {

    const data = query.data;
    const id = query.message.chat.id

    //bot.deleteMessage(id, query.message.message_id)

    console.log(query)

    switch (data) {
        case 'info':
            bot.editMessageText( `Інфориація`, {
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
            /*bot.sendMessage(id, `Оплата`, {
                reply_markup: {
                    inline_keyboard: keyboard.payment
                }
            })*/
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
            bot.editMessageText( `loremisdjfisd fsd fusdh fisdhf 
            dsjhbf jshdvfbg fdskghdsfv 
            kjsdhfv dksjfhv dfjkhgv dfjhgvsjh
             vsjhv asjh`, {
                chat_id : id,
                message_id: query.message.message_id,
                reply_markup: {
                    inline_keyboard: keyboard.delivery_nova
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

function debug(obj={}){
    return JSON.stringify(obj, null, 4)
}

module.exports = router;
