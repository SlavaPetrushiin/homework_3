const express = require('express');
const router = express.Router();
const flash = require('connect-flash');
const ENGINE = global.ENGINE;
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
const upload = global.UPLOAD;

/* GET home page. */
router.get('/', function(req, res, next) {
	let products = db.get('products').value();
	let skills = db.get('skills').value();
	let social = db.get('social').value();
	let messageFlash = req.flash('msgsemail')[0] || null;
	res.render('pages/index', { 
		products,
		skills,
		social,
		messageFlash
	});
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
router.post('/admin/upload', upload.single('photo'), function(req, res, next) {
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
	let social = db.get('social').value();
  res.render('pages/login.pug', { social });
});

router.post('/login', function(req, res, next) {
	ENGINE.emit('post/authorization', req.body)
	.then(data => res.redirect(data))
});

module.exports = router;
