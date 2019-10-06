var express = require('express');
var router = express.Router();
var ENGINE = global.ENGINE;


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('pages/index', { title: 'Express' });
});

router.post('/', function(req, res, next) {
	ENGINE.emit('post/message', req.body)
	.then(data => console.log(data))
	.catch(error => res.render('error', {message: error.message}))
});

router.get('/admin', function(req, res, next) {
  res.render('pages/admin.pug', { title: 'Express' });
});

router.post('/admin/upload', function(req, res, next) {
  //res.render('pages/admin.pug', { title: 'Express' });
});

router.post('/admin/skills', function(req, res, next) {
	ENGINE.emit('skills', req.body)
	//.then(data => res.redirect(data))
});

router.get('/login', function(req, res, next) {
  res.render('pages/login.pug', { title: 'Express' });
});

router.post('/login', function(req, res, next) {
	ENGINE.emit('post/authorization', req.body)
	.then(data => res.redirect(data))
});

module.exports = router;
