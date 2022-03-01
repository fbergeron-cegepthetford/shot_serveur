var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send("SHOT - Stochatisque, humoristique, original, tiguidou");
});

module.exports = router;
