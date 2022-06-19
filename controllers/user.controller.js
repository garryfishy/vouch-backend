const UserService = require('../services/user.service');
const { sign } = require('../helpers/jwt');
class UserController {
  static async enterRoom(req, res) {
    let checkLogin = await UserService.checkLogin(req.body);
    if (checkLogin) {
      res.status(400).json({ msg: 'Username has been taken in this room' });
    } else {
      let result = await UserService.enterRoom(req.body, res);
      let token = await sign(
        {
          username: result.dataValues.username,
          roomname: result.dataValues.roomname,
        },
        'process.env.secretpassword'
      );
      res.status(200).json(token);
    }
  }

  static async leaveRoom(req, res) {
    return await UserService.leaveRoom(req.user, res);
  }
}

module.exports = UserController;
