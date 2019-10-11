const express = require('express');
const router = express.Router();
const flash = require('connect-flash');
const ENGINE = global.ENGINE;
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);

/* GET home page. */
router.get('/', function(req, res, next) {
	let products = db.get('products').value();
	let skills = db.get('skills').value();
	console.log(req.flash().msgsemail)
	let messageFlash = req.flash().msgsemail;
	if(messageFlash){
		console.log('Теперь я здесь, есть клик!')
		//let message = req.flash().msgsemail[0];
		res.render('pages/index', { products: products, skills : skills, msgsemail: message});
	} else {
		console.log('Я тута')
		res.render('pages/index', { products: products, skills : skills});
	}

});

router.post('/', function(req, res, next) {
	ENGINE.emit('post/message', req.body)
		.then(data => {
			req.flash('msgsemail', data.msgsemail)
			res.redirect('/');
		})
		.catch(error => res.render('error', {message: error.message}))
});

//администрирование
router.get('/admin', function(req, res, next) {
  res.render('pages/admin.pug', { title: 'Express' });
});


//Загрузка фотографии
router.post('/admin/upload', function(req, res, next) {
	ENGINE.emit('/admin/upload', req)
		.then(data => res.redirect('/admin'))
		.catch(error => res.render('error', {message: error.message}))
});

//Загрузка скилов
router.post('/admin/skills', function(req, res, next) {
	ENGINE.emit('/admin/skills', req.body)
		.then(data => res.render('pages/admin.pug', data))
		.catch(error => res.render('error', {message: error.message}))
});

//логирование
router.get('/login', function(req, res, next) {
  res.render('pages/login.pug', { title: 'Express' });
});

router.post('/login', function(req, res, next) {
	ENGINE.emit('post/authorization', req.body)
	.then(data => res.redirect(data))
});

module.exports = router;
