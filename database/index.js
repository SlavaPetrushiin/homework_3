const ee = require('@nauma/eventemitter');
const DATABASE = new ee.EventEmitter('database');
const fs = require('fs');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
 
const adapter = new FileSync('db.json')
const db = low(adapter);

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

DATABASE.on('/admin/skills', response => {
	let numbers = []; //массив для данных пользователя
	for (let key in response.data){
		numbers.push(response.data[key])
	}
	let skills = db.get('skills').value();
	skills.forEach((item, index) => {
		item.number = numbers[index]
	});
	db.unset('skills')
		.write();
	db.set('skills', skills)
		.write()
	response.reply({msgskill : "Данные сохранены!"})				
});

DATABASE.on('/admin/upload', response => {
	let file = response.data;
	db.get('products')
		.push({
      "src": `./images/products/${file.originalname}`,
      "name": file.userName,
      "price": file.userPrice			
		})
		.write()
		response.reply({msgfile : "Данные сохранены!"})
});