const ee = require('@nauma/eventemitter');
const ENGINE = new ee.EventEmitter('engine');
const joi = require('@hapi/joi');
global.ENGINE = ENGINE;

ENGINE.on('post/message', response => {
	const {	name, email, message } = response.data;

	const schema = joi.object().keys({
		name: joi.string().min(3).max(30).required(),
		email: joi.string().email().required(),
		message: joi.string().min(2).max(3000).required()
	})

	const result = schema.validate(response.data);
	const {value, error} = result;
	const valid = error == undefined;
	if(!valid){
		//console.log(response.reply)
		response.reply( {status: 200} );
	} else {
		//console.log(5555555555555555555555)
		response.reply( {msgsemail : "Сообщение доставлено!"} )
	}
})

ENGINE.on('post/authorization', response => {
	const {	email, passowrd } = response.data;
	console.log('work')
	const schema = joi.object().keys({
		email: joi.string().email().required(),
		password : joi.string().min(7).alphanum().required()
	})

	const result = schema.validate(response.data);
	const {value, error} = result;
	const valid = error == undefined;
	if(!valid){
		response.reply( {status: error} );
	} else {
		DATABASE.emit('post/authorization', response.data)
		.then((data) => {
			if (data){
				response.reply('/admin')
			} else {
				response.reply({msgslogin : "Вход запрещен"})
			}
		})
		.catch(_ => response.replyErr({ message: 'Какая та ошибка!' }));
	}
})

ENGINE.on('skills', response => {
	let {age, concerts, cities, years} = response.data;
	if (age !== undefined && concerts !== undefined && cities !== undefined && years !== undefined){
		DATABASE.emit('skills', response.data)
	}
})

ENGINE.on('/admin/upload', response => {
	let { name, price } = response.data.body;
	let userFile = response.data.file;
	userFile.userName = name;
	userFile.userPrice = price;

	DATABASE.emit('/admin/upload', userFile)
})