require('dotenv').config();
process.env.NTBA_FIX_319 = 1;

//VIBER
const ViberBot = require('viber-bot').Bot,
BotEvents = require('viber-bot').Events,
TextMessage = require('viber-bot').Message.Text,
express = require('express');
const app = express();

/*
const vbot = new ViberBot({
    authToken: VIBER_TOKEN,
    name: "uataobot",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Katze_weiss.png"
});

vbot.on(BotEvents.MESSAGE_RECEIVED, (message, response) => {
    response.send(new TextMessage(`Message received.`));
    console.log(response.userProfile.name);
});

vbot.onTextMessage(/^привет|добрый день$/i, (message, response) =>
    response.send(new TextMessage(`Hi there ${response.userProfile.name}. I am ${response.name}`)));

var userProfile = {id: '3p92Qdl8Vg5pW1k9aRkJwg=='};
vbot.sendMessage(userProfile, new TextMessage("Thanks for shopping with us"));

vbot.getBotProfile().then(response => console.log(`Bot Named: ${response.name}`));

const port = process.env.PORT;
app.use("/viber/webhook", vbot.middleware());
app.listen(port, () => {
    console.log(`Application running on port: ${port}`);
    vbot.setWebhook(`https://a5284d57.ngrok.io/viber/webhook`).catch(error => {
        console.log('Can not set webhook on following server. Is it running?');
        console.error(error);
        process.exit(1);
    });
});

*/

//TELEGRAM


/*const TelegramBot = require('node-telegram-bot-api');
const mysql = require("mysql2");

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {polling: true});


const connection = mysql.createConnection({
  host: "localhost",
  user: "admin",
  database: "bot_db",
  password: "99221globus"
});


bot.on('message', msg => {
	bot.sendMessage(msg.chat.id, `Привет, ${msg.from.first_name}!`)

	var sql = `INSERT INTO telegram_users (chat_id, user) VALUES (${msg.from.id}, '${msg.from.first_name}')`;
	  connection.query(sql, function (err, result) {
	    if (err) throw err;
	    console.log("1 record inserted");
	  });

	  console.log(msg.chat.id);

})*/


//Import routes
const postsRoute = require('./routes/telegram');

app.use('/posts', postsRoute);


app.listen(process.env.PORT, () => {
    console.log(`Application running...`);
    
});