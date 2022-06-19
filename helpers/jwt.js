const jwt = require('jsonwebtoken');
const { ChatroomUser } = require('../models');
const { Op } = require('sequelize');
async function sign(payload, secretcode) {
  return await jwt.sign({ payload }, secretcode);
}

async function authentication(req, res, next) {
  const { access_token } = req.headers;

  try {
    if (access_token) {
      const tokenUser = jwt.verify(access_token, 'process.env.secretpassword');
      // console.log(tokenUser, "<<<<ini access token coba")
      let result = await ChatroomUser.findOne({
        where: {
          [Op.and]: [
            { username: tokenUser.payload.username },
            { roomname: tokenUser.payload.roomname },
          ],
        },
      });
      if (result) {
        req.user = {
          username: result.dataValues.username,
          roomname: result.dataValues.roomname,
        };
        if (result) {
          next();
        } else {
          throw {
            code: 401,
            name: 'invalidJWT',
          };
        }
      }
    }
  } catch (error) {
    // console.log(error)
    next(error);
  }
}

module.exports = { sign, authentication };
