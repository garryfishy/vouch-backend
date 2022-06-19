'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChatroomUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ChatroomUser.init(
    {
      username: DataTypes.STRING,
      roomname: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'ChatroomUser',
    }
  );
  return ChatroomUser;
};
