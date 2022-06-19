const express = require('express');
const app = require('../app');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const { authentication } = require('../helpers/jwt');
router.get('/', (req, res) => {
  res.send('Hello World!');
});

router.post('/enterRoom', UserController.enterRoom);
router.use(authentication);
router.post('/leaveRoom', UserController.leaveRoom);

router;
module.exports = router;
