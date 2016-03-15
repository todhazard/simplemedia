/* main DAL routes */
var express = require('express');
var router = express.Router();

var ctrlMedia	= require('../controllers/mediaController');
var ctrlDistinctMedia	= require('../controllers/distinctMediaController');

router.get('/mediadistinct', ctrlDistinctMedia.getDistinctVals);

router.get('/media', ctrlMedia.getAllMedias);
router.post('/media', ctrlMedia.createOneMedia);
router.get('/media/:id', ctrlMedia.getOneMedia);
router.put('/media/:id', ctrlMedia.updateMedia);
router.delete('/media/:id', ctrlMedia.deleteMedia);



module.exports = router;
