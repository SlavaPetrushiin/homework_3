var express = require('express');
var router = express.Router();
var ENGINE = global.ENGINE;
const Joi = require('@hapi/joi');
// Не видет
console.log(ENGINE)

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('pages/index', { title: 'Express' });
});

router.post('/', function(req, res, next) {
	/*res.send(req.body)*/
	ENGINE.emit('message', req.body)
	.then(data => res.send(data))
});

router.get('/admin', function(req, res, next) {
  res.render('pages/admin.pug', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('pages/login.pug', { title: 'Express' });
});

module.exports = router;
