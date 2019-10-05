const ee = require('@nauma/eventemitter');
const ENGINE = new ee.EventEmitter('engine');
global.ENGINE = ENGINE;

// Не работает
ENGINE.on('message', async response => {
	console.log(response)
	let  { name, email, message} = response.body;
	response.reply({name, email, message})
})