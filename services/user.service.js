const { ChatroomUser } = require('../models');
const { Op } = require('sequelize');

exports.enterRoom = async function (body, res) {
  try {
    let create = await ChatroomUser.create(body);
    return create;
  } catch (error) {
    throw error;
  }
};

exports.checkLogin = async function (body, res) {
  try {
    let checkLogin = await ChatroomUser.findOne({
      where: {
        [Op.and]: [{ username: body.username }, { roomname: body.roomname }],
      },
    });
    return checkLogin;
  } catch (error) {
    throw error;
  }
};

exports.leaveRoom = async function (user, res) {
  try {
    console.log(user);
    let logout = await ChatroomUser.destroy({
      where: {
        [Op.and]: [{ username: user.username }, { roomname: user.roomname }],
      },
    });
    res.status(200).json({ msg: 'User has left the room' });
  } catch (error) {
    throw error;
  }
};
