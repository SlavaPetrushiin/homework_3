const express = require('express');
const router = express.Router();
const flash = require('connect-flash');
const ENGINE = global.ENGINE;
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);

const multer  = require("multer");

const storage = multer.diskStorage({
	destination : ( req, file, cb ) =>{
		cb(null, "public/images/products");
	},
	filename: (req, file, cb) =>{
		cb(null, file.originalname);
	}	
})

const upload = multer({
	storage : storage,
	limits: {fieldSize: 2 * 1024 * 1024},
})



//const upload = global.UPLOAD;

/* GET home page. */
router.get('/', function(req, res, next) {
	ENGINE.emit('pages/home', req)
		.then(data => {
			let {products, skills, social} = data;
			let msgsemail = req.flash('msgsemail')[0] || null;
			res.render('pages/index', { 
				products,
				skills,
				social,
				msgsemail
			});			
		})
		.catch(error => res.render('error', {message: error.message}))
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
	let msgskill = req.flash('msgskill')[0] || null;
	let msgfile = req.flash('msgfile')[0] || null;
  res.render('pages/admin.pug', {msgskill, msgfile});
});


//Загрузка фотографии
router.post('/admin/upload', upload.single('photo'), function(req, res, next) {
	ENGINE.emit('/admin/upload', req)
		.then(data => {
			req.flash('msgfile', data.msgfile);
			res.redirect('/admin');
		})
		.catch(error => res.render('error', {message: error.message}))
});

//Загрузка скилов
router.post('/admin/skills', function(req, res, next) {
	ENGINE.emit('/admin/skills', req.body)
		.then(data => {
			req.flash('msgskill', data.msgskill);
			res.redirect('/admin');
		})
		.catch(error => res.render('error', {message: error.message}))
});

//логирование
router.get('/login', function(req, res, next) {
	ENGINE.emit('login/social', req)
		.then(data => {
			let social = data;
			res.render('pages/login.pug', { social });
		})
		.catch(error => res.render('error', {message: error.message}))
});

router.post('/login', function(req, res, next) {
	ENGINE.emit('login/authorization', req.body)
		.then(data => res.redirect(data))
		.catch(error => res.render('error', {message: error.message}))
});

module.exports = router;
