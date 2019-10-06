const ee = require('@nauma/eventemitter');
const DATABASE = new ee.EventEmitter('database');
const fs = require('fs');
global.DATABASE = DATABASE;

const adminEmail = 'slava@mail.ru';
const adminPassword = '12345678'

DATABASE.on('post/authorization', response => {
	const {	email, password } = response.data;
	console.log(email, password)

	if(email === adminEmail && password === adminPassword){
		response.reply(true);
	} else {
		response.reply(false);
	}
});

DATABASE.on('skills', response => {
	fs.readFile('views/common/_vars.pug', 'utf8',  (error,data) => {
		if(error) throw error; // если возникла ошибка
		console.log(data);  // выводим считанные данные
	})
	console.log(response)
});