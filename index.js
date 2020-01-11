const TelegramBot = require('node-telegram-bot-api');

const TOKEN = '1005375475:AAHF25XkUu3SpqyjvrYyKxcdZQBqod2YMfE';

const bot = new TelegramBot(TOKEN, {polling: true});

bot.on('message', msg => {
	bot.sendMessage(msg.chat.id, `Привет, ${msg.from.first_name}!`)
})





const ViberBot = require('viber-bot').Bot;
const BotEvents = require('viber-bot').Events;

const bot = new ViberBot({
	authToken: "4ae29d599827ddd3-b949f894682f6997-6b7417e64af5280",
	name: "UaTaoBot",
});

// Perfect! Now here's the key part:
bot.on(BotEvents.MESSAGE_RECEIVED, (message, response) => {
	// Echo's back the message to the client. Your bot logic should sit here.
	response.send(message);
});
/*
// Wasn't that easy? Let's create HTTPS server and set the webhook:
const https = require('https');
const port = process.env.PORT || 8080;

// Viber will push messages sent to this URL. Web server should be internet-facing.
const webhookUrl = process.env.WEBHOOK_URL;

const httpsOptions = {
	key: ...,
	cert: ...,
	ca: ...
}; // Trusted SSL certification (not self-signed).
https.createServer(httpsOptions, bot.middleware()).listen(port, () => bot.setWebhook(webhookUrl));*/